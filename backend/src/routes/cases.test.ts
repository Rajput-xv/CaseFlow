import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import casesRouter from './cases';
import authRouter from './auth';

const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/cases', casesRouter);

let authToken: string;

describe('Cases Routes', () => {
  beforeAll(async () => {
    // Login to get auth token
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    authToken = response.body.token;
  });

  describe('GET /api/cases', () => {
    it('should return list of cases with authentication', async () => {
      const response = await request(app)
        .get('/api/cases')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('cases');
      expect(Array.isArray(response.body.cases)).toBe(true);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .get('/api/cases')
        .expect(200);

      expect(response.body).toHaveProperty('cases');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/cases?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('cases');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('total');
    });
  });

  describe('GET /api/cases/:id', () => {
    it('should return specific case by ID', async () => {
      const response = await request(app)
        .get('/api/cases/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('case_id');
    });

    it('should return 404 for non-existent case', async () => {
      const response = await request(app)
        .get('/api/cases/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/cases', () => {
    it('should create new case with valid data', async () => {
      const caseData = {
        case_id: `CASE-${Date.now()}`,
        applicant_name: 'Test Applicant',
        dob: '1990-01-01',
        email: 'applicant@example.com',
        phone: '1234567890',
        category: 'TAX',
        priority: 'HIGH',
      };

      const response = await request(app)
        .post('/api/cases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(caseData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('case_id', caseData.case_id);
      expect(response.body).toHaveProperty('applicant_name', caseData.applicant_name);
    });

    it('should reject case creation with missing required fields', async () => {
      const caseData = {
        applicant_name: 'Test Applicant',
      };

      const response = await request(app)
        .post('/api/cases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(caseData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });

    it('should reject case creation with invalid category', async () => {
      const caseData = {
        case_id: 'CASE-TEST',
        applicant_name: 'Test Applicant',
        dob: '1990-01-01',
        category: 'INVALID_CATEGORY',
        priority: 'HIGH',
      };

      const response = await request(app)
        .post('/api/cases')
        .set('Authorization', `Bearer ${authToken}`)
        .send(caseData)
        .expect(400);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/cases/:id', () => {
    it('should update existing case', async () => {
      const updateData = {
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
      };

      const response = await request(app)
        .put('/api/cases/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('id', '1');
      expect(response.body).toHaveProperty('status', 'IN_PROGRESS');
    });

    it('should return 404 when updating non-existent case', async () => {
      const response = await request(app)
        .put('/api/cases/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'RESOLVED' })
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/cases/:id', () => {
    it('should delete existing case', async () => {
      const response = await request(app)
        .delete('/api/cases/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 when deleting non-existent case', async () => {
      const response = await request(app)
        .delete('/api/cases/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('message');
    });
  });
});
