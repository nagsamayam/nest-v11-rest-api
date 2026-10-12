import { Injectable, OnModuleInit } from '@nestjs/common';
import * as argon2 from 'argon2';
import { randomBytes } from 'node:crypto';

@Injectable()
export class PasswordService implements OnModuleInit {
  private dummyHash = '';

  async onModuleInit(): Promise<void> {
    // Used to burn the same CPU time when the account does not exist, so response timing does
    // not reveal which emails are registered.
    this.dummyHash = await this.hash(randomBytes(16).toString('hex'));
  }

  // Argon2id with the OWASP minimum profile (19 MiB, 2 iterations, 1 lane). Raise memoryCost if
  // your instances have headroom - the parameters are embedded in each hash, so old hashes keep
  // verifying.
  async hash(plain: string): Promise<string> {
    return await argon2.hash(plain, {
      type: argon2.argon2id,
      memoryCost: 19_456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  async verify(plain: string, hash: string | null): Promise<boolean> {
    try {
      const matches = await argon2.verify(hash ?? this.dummyHash, plain);
      return hash !== null && matches;
    } catch {
      return false; // malformed stored hash must never surface as a 500 or bypass the check
    }
  }
}
