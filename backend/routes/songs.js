const express = require('express');
const path = require('path');
const fs = require('fs');
const { ObjectId } = require('mongodb');

const upload = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public fields returned to normal users
const publicFields = {
  title: 1,
  artist: 1,
  category: 1,
  language: 1,
  description: 1,
  type: 1,
  mediaUrl: 1,
  coverUrl: 1,
  allowDownload: 1,
  createdAt: 1
};

// Helper functions
function cleanText(value, max = 160) {
  return String(value || '').trim().slice(0, max);
}

function validId(id) {
  return ObjectId.isValid(id);
}

// Remove uploaded media files
function removeUpload(url) {
  if (!url || !url.startsWith('/uploads/')) return;

  const root = path.resolve(__dirname, '..', 'uploads');
  const target = path.resolve(
    root,
    `.${url}`.replace('/uploads', '')
  );

  if (target.startsWith(root + path.sep)) {
    fs.unlink(target, () => {});
  }
}

// Generate uploaded file URL
function uploadedUrl(file, folder) {
  return file ? `/uploads/${folder}/${file.filename}` : undefined;
}


// ==========================================
// 1. GET ALL PUBLISHED SONGS
// ==========================================

router.get('/', async (req, res, next) => {
  try {
    const songs = req.app.locals.db.get('songs');

    const query = cleanText(req.query.q, 100);
    const category = cleanText(req.query.category, 60);

    const filter = {
      status: 'published'
    };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (query) {
      const searchRegex = query.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );

      filter.$or = [
        {
          title: {
            $regex: searchRegex,
            $options: 'i'
          }
        },
        {
          artist: {
            $regex: searchRegex,
            $options: 'i'
          }
        }
      ];
    }

    const items = await songs.find(filter, {
      fields: publicFields,
      sort: { createdAt: -1 },
      limit: 100
    });

    res.json(items);

  } catch (err) {
    next(err);
  }
});


// ==========================================
// 2. GET ALL SONGS (ADMIN)
// ==========================================

router.get('/admin/all', requireAdmin, async (req, res, next) => {
  try {
    const items = await req.app.locals.db
      .get('songs')
      .find({}, {
        sort: { createdAt: -1 },
        limit: 500
      });

    res.json(items);

  } catch (err) {
    next(err);
  }
});


// ==========================================
// 3. GET ADMIN DASHBOARD STATISTICS
// ==========================================

router.get('/admin/stats', requireAdmin, async (req, res, next) => {
  try {
    const songs = req.app.locals.db.get('songs');

    const [total, published, drafts] = await Promise.all([
      songs.count({}),
      songs.count({ status: 'published' }),
      songs.count({ status: 'draft' })
    ]);

    res.json({
      total,
      published,
      drafts
    });

  } catch (err) {
    next(err);
  }
});


// ==========================================
// 4. GET A SINGLE PUBLISHED SONG
// ==========================================

router.get('/:id', async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid item ID'
      });
    }

    const item = await req.app.locals.db
      .get('songs')
      .findOne(
        {
          _id: new ObjectId(req.params.id),
          status: 'published'
        },
        {
          fields: publicFields
        }
      );

    if (!item) {
      return res.status(404).json({
        message: 'Song or video not found'
      });
    }

    res.json(item);

  } catch (err) {
    next(err);
  }
});


// ==========================================
// 5. UPLOAD A NEW SONG OR VIDEO (ADMIN)
// ==========================================

router.post(
  '/',
  requireAdmin,
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      const title = cleanText(req.body.title, 160);
      const artist = cleanText(req.body.artist, 120);

      const media = req.files?.media?.[0];
      const cover = req.files?.cover?.[0];

      if (!title || !artist || !media) {
        if (media) {
          removeUpload(`/uploads/media/${media.filename}`);
        }

        if (cover) {
          removeUpload(`/uploads/covers/${cover.filename}`);
        }

        return res.status(400).json({
          message: 'Title, artist, and an MP3/MP4 media file are required'
        });
      }

      const ext = path.extname(media.originalname).toLowerCase();

      const type = ['.mp4', '.webm'].includes(ext)
        ? 'video'
        : 'audio';

      const item = {
        title,
        artist,

        category: cleanText(req.body.category || 'Gospel', 60),
        language: cleanText(req.body.language || 'Kinyarwanda', 50),
        description: cleanText(req.body.description, 2000),

        type,

        mediaUrl: uploadedUrl(media, 'media'),
        coverUrl: uploadedUrl(cover, 'covers') || '',

        allowDownload: req.body.allowDownload === 'true',

        status: req.body.status === 'published'
          ? 'published'
          : 'draft',

        createdAt: new Date(),
        updatedAt: new Date(),

        uploadedBy: req.admin.email
      };

      const result = await req.app.locals.db
        .get('songs')
        .insert(item);

      res.status(201).json(result);

    } catch (err) {
      next(err);
    }
  }
);


// ==========================================
// 6. UPDATE AN EXISTING SONG OR VIDEO (ADMIN)
// ==========================================

router.put(
  '/:id',
  requireAdmin,
  upload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]),
  async (req, res, next) => {
    try {
      if (!validId(req.params.id)) {
        return res.status(400).json({
          message: 'Invalid item ID'
        });
      }

      const songs = req.app.locals.db.get('songs');
      const id = new ObjectId(req.params.id);

      const current = await songs.findOne({
        _id: id
      });

      if (!current) {
        return res.status(404).json({
          message: 'Item not found'
        });
      }

      const patch = {
        updatedAt: new Date()
      };

      // Update text fields
      for (const key of [
        'title',
        'artist',
        'category',
        'language',
        'description'
      ]) {
        if (req.body[key] !== undefined) {
          patch[key] = cleanText(
            req.body[key],
            key === 'description' ? 2000 : 160
          );
        }
      }

      // Update publishing status
      if (req.body.status !== undefined) {
        patch.status = req.body.status === 'published'
          ? 'published'
          : 'draft';
      }

      // Update download permission
      if (req.body.allowDownload !== undefined) {
        patch.allowDownload = req.body.allowDownload === 'true';
      }

      const media = req.files?.media?.[0];
      const cover = req.files?.cover?.[0];

      // Replace media file
      if (media) {
        patch.mediaUrl = uploadedUrl(media, 'media');

        patch.type = ['.mp4', '.webm'].includes(
          path.extname(media.originalname).toLowerCase()
        )
          ? 'video'
          : 'audio';

        removeUpload(current.mediaUrl);
      }

      // Replace cover image
      if (cover) {
        patch.coverUrl = uploadedUrl(cover, 'covers');

        removeUpload(current.coverUrl);
      }

      const updated = await songs.findOneAndUpdate(
        { _id: id },
        { $set: patch },
        { returnOriginal: false }
      );

      res.json(updated || {
        ...current,
        ...patch
      });

    } catch (err) {
      next(err);
    }
  }
);


// ==========================================
// 7. DELETE A SONG OR VIDEO (ADMIN)
// ==========================================

router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid item ID'
      });
    }

    const songs = req.app.locals.db.get('songs');

    const item = await songs.findOne({
      _id: new ObjectId(req.params.id)
    });

    if (!item) {
      return res.status(404).json({
        message: 'Item not found'
      });
    }

    await songs.remove({
      _id: item._id
    });

    removeUpload(item.mediaUrl);
    removeUpload(item.coverUrl);

    res.json({
      success: true
    });

  } catch (err) {
    next(err);
  }
});


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;