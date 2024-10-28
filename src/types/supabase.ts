export interface Database {
  public: {
    Tables: {
      blog_categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['blog_categories']['Insert']>
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          excerpt: string
          content: string
          image_url: string
          author: {
            name: string
            avatar_url?: string
            bio?: string
          }
          category_id: string
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['blog_posts']['Insert']>
      }
      blog_posts_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: Database['public']['Tables']['blog_posts_tags']['Row']
        Update: Partial<Database['public']['Tables']['blog_posts_tags']['Row']>
      }
      blog_tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['blog_tags']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['blog_tags']['Insert']>
      }
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          message: string
          read: boolean
          replied: boolean
        }
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          image_url: string
          github_url?: string
          demo_url?: string
          technologies: string[]
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}
