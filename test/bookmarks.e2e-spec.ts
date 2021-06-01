import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import BookmarksModule from '../src/modules/bookmarks/bookmarks.module';

describe('BookmarksController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BookmarksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/bookmarks (GET)', () => {
    it('should not get any document /bookmarks (GET)', () => {
      return request(app.getHttpServer()).get('/bookmarks').expect(200).expect({
        count: 0,
        results: [],
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
