import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

const vimeoBookmark = {
  contentDetails: {
    width: 480,
    height: 360,
    duration: 23,
  },
  tags: ['vimeo'],
  _id: '',
  type: 'video',
  author: '',
  title: 'My video',
  createdAt: '',
  updatedAt: '',
  __v: 0,
};

const flickrBookmark = {
  contentDetails: {
    width: 1024,
    height: 683,
  },
  tags: ['flickr'],
  _id: '',
  type: 'photo',
  author: '',
  title: 'ZB8T0193',
  createdAt: '',
  updatedAt: '',
  __v: 0,
};

describe('BookmarksController (e2e)', () => {
  let app: INestApplication;
  let documentId: string;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  describe('/bookmarks (POST)', () => {
    it('should create one new document for flickr /bookmarks (POST)', function () {
      return request(app.getHttpServer())
        .post('/bookmarks')
        .set('Content-Type', 'application/json')
        .send('{"url":"http://www.flickr.com/photos/bees/2341623661/","tags":["flickr"]}')
        .expect(201)
        .expect((res) => {
          documentId = res.body._id;
          res.body._id = '';
          res.body.author = '';
          res.body.createdAt = '';
          res.body.updatedAt = '';
        })
        .expect(flickrBookmark);
    });
    it('should create one new document for vimeo /bookmarks (POST)', function () {
      return request(app.getHttpServer())
        .post('/bookmarks')
        .set('Content-Type', 'application/json')
        .send('{"url":"https://vimeo.com/286898202","tags":["vimeo"]}')
        .expect(201)
        .expect((res) => {
          res.body._id = '';
          res.body.author = '';
          res.body.createdAt = '';
          res.body.updatedAt = '';
        })
        .expect(vimeoBookmark);
    });
    it('should not create new document and throw 400 error /bookmarks (POST)', function () {
      return request(app.getHttpServer())
        .post('/bookmarks')
        .set('Content-Type', 'application/json')
        .send('{"tags":["vimeo"]}')
        .expect(400);
    });
    it('should not create new document and throw 400 error /bookmarks (POST)', function () {
      return request(app.getHttpServer())
        .post('/bookmarks')
        .set('Content-Type', 'application/json')
        .send('{"tags": "a", "url":"https://vimeo.com/286898202", }')
        .expect(400);
    });
  });
  describe('/bookmarks (GET)', () => {
    it('should get two documents /bookmarks (GET)', () => {
      return request(app.getHttpServer())
        .get('/bookmarks')
        .expect(200)
        .expect((res) => {
          res.body.results = res.body.results.length;
        })
        .expect({
          count: 2,
          results: 2,
        });
    });
    it('should get a document with query tags /bookmarks (GET)', () => {
      return request(app.getHttpServer())
        .get('/bookmarks')
        .query({ 'tags[]': 'flickr' })
        .expect(200)
        .expect((res) => {
          res.body.results = res.body.results.length;
        })
        .expect({
          count: 1,
          results: 1,
        });
    });
    it('should get a document with query type /bookmarks (GET)', () => {
      return request(app.getHttpServer())
        .get('/bookmarks')
        .query({ type: 'photo' })
        .expect(200)
        .expect((res) => {
          res.body.results = res.body.results.length;
        })
        .expect({
          count: 1,
          results: 1,
        });
    });
    it('should get a document with query title /bookmarks (GET)', () => {
      return request(app.getHttpServer())
        .get('/bookmarks')
        .query({ title: 'My' })
        .expect(200)
        .expect((res) => {
          res.body.results = res.body.results.length;
        })
        .expect({
          count: 1,
          results: 1,
        });
    });
  });

  describe('/bookmarks/:id (PUT)', () => {
    it('should update a document with url', () => {
      vimeoBookmark.__v = 1;
      return request(app.getHttpServer())
        .put(`/bookmarks/${documentId}`)
        .set('Content-Type', 'application/json')
        .send('{"url":"https://vimeo.com/286898202","tags":["vimeo"]}')
        .expect(200)
        .expect((res) => {
          res.body._id = '';
          res.body.author = '';
          res.body.createdAt = '';
          res.body.updatedAt = '';
        })
        .expect(vimeoBookmark);
    });
    it('should update a document tags with url', () => {
      vimeoBookmark.__v = 2;
      vimeoBookmark.tags = ['vimeo', 'updated'];
      return request(app.getHttpServer())
        .put(`/bookmarks/${documentId}`)
        .set('Content-Type', 'application/json')
        .send('{"tags":["vimeo", "updated"]}')
        .expect(200)
        .expect((res) => {
          res.body._id = '';
          res.body.author = '';
          res.body.createdAt = '';
          res.body.updatedAt = '';
        })
        .expect(vimeoBookmark);
    });
    it('should not update a document and throw a 400', () => {
      return request(app.getHttpServer())
        .put(`/bookmarks/${documentId}`)
        .set('Content-Type', 'application/json')
        .send('{"url":"12345","tags":["vimeo"]}')
        .expect(400);
    });
  });

  describe('/bookmarks/:id (DELETE)', () => {
    it('should delete a document', () => {
      return request(app.getHttpServer())
        .delete(`/bookmarks/${documentId}`)
        .expect(200)
        .expect((res) => {
          res.body._id = '';
          res.body.author = '';
          res.body.createdAt = '';
          res.body.updatedAt = '';
        })
        .expect(vimeoBookmark);
    });
    it('should not delete a document and throw a 400', () => {
      return request(app.getHttpServer()).put(`/bookmarks/aabb`).expect(400);
    });
  });
  afterAll(async () => {
    const db: typeof mongoose = app.get('DATABASE_CONNECTION');
    await db.connection.db.dropCollection('bookmarks');
    await app.close();
  });
});
