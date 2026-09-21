import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name too short').max(60),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit Indian mobile'),
  password: z.string().min(8, 'Min 8 characters'),
  city: z.string().optional(),
  position: z.enum(['GK','Defender','Midfielder','Forward']).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const bookingSchema = z.object({
  matchId: z.string().cuid(),
  upiIdUsed: z.string().min(5, 'Enter UPI ID used').max(60),
  screenshotUrl: z.string().url('Upload payment screenshot first'),
});

export const matchCreateSchema = z.object({
  venueId: z.string().cuid(),
  date: z.string().datetime().or(z.string()),
  startTime: z.string().datetime().or(z.string()),
  endTime: z.string().datetime().or(z.string()),
  category: z.enum(['STANDARD', 'PLUS']),
  price: z.number().int().min(0).max(5000),
  maxPlayers: z.number().int().min(2).max(30).default(14),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5).max(1000),
  imageUrl: z.string().url().optional().or(z.literal('')),
  matchId: z.string().cuid().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(60).optional(),
  city: z.string().optional(),
  position: z.enum(['GK','Defender','Midfielder','Forward']).optional(),
  avatarUrl: z.string().url().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
