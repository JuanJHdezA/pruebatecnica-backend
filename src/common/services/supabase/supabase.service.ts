import { environments } from '@environments/environment';
import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      environments.supabaseConfig.SUPABASE_URL,
      environments.supabaseConfig.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  get supabase(): SupabaseClient {
    return this.client;
  }
}
