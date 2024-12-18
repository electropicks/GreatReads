export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      bookshelf: {
        Row: {
          bookshelf_id: number;
          bookshelf_name: string;
          created_at: string | null;
          user_id: string;
        };
        Insert: {
          bookshelf_id?: number;
          bookshelf_name: string;
          created_at?: string | null;
          user_id: string;
        };
        Update: {
          bookshelf_id?: number;
          bookshelf_name?: string;
          created_at?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      bookshelf_book: {
        Row: {
          bookshelf_id: number;
          created_at: string | null;
          google_book_id: string;
          id: number;
        };
        Insert: {
          bookshelf_id: number;
          created_at?: string | null;
          google_book_id: string;
          id?: number;
        };
        Update: {
          bookshelf_id?: number;
          created_at?: string | null;
          google_book_id?: string;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'bookshelf_book_bookshelf_id_fkey';
            columns: ['bookshelf_id'];
            isOneToOne: false;
            referencedRelation: 'bookshelf';
            referencedColumns: ['bookshelf_id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          email: string | null;
          full_name: string | null;
          id: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      user_book: {
        Row: {
          created_at: string | null;
          finished_date: string | null;
          google_book_id: string;
          note: string | null;
          rating: number | null;
          read_status: Database['public']['Enums']['ReadStatus'];
          started_date: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          finished_date?: string | null;
          google_book_id: string;
          note?: string | null;
          rating?: number | null;
          read_status?: Database['public']['Enums']['ReadStatus'];
          started_date?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          finished_date?: string | null;
          google_book_id?: string;
          note?: string | null;
          rating?: number | null;
          read_status?: Database['public']['Enums']['ReadStatus'];
          started_date?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      z_author: {
        Row: {
          author_id: number;
          author_name: string;
          created_at: string;
        };
        Insert: {
          author_id?: number;
          author_name: string;
          created_at?: string;
        };
        Update: {
          author_id?: number;
          author_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      z_author_book: {
        Row: {
          author_id: number;
          book_id: number;
          created_at: string;
          id: number;
        };
        Insert: {
          author_id: number;
          book_id: number;
          created_at?: string;
          id?: number;
        };
        Update: {
          author_id?: number;
          book_id?: number;
          created_at?: string;
          id?: number;
        };
        Relationships: [];
      };
      z_book: {
        Row: {
          book_id: number;
          created_at: string | null;
          google_books_id: string;
          title: string | null;
        };
        Insert: {
          book_id?: number;
          created_at?: string | null;
          google_books_id: string;
          title?: string | null;
        };
        Update: {
          book_id?: number;
          created_at?: string | null;
          google_books_id?: string;
          title?: string | null;
        };
        Relationships: [];
      };
      z_genre: {
        Row: {
          created_at: string;
          genre_id: number;
          genre_name: string;
        };
        Insert: {
          created_at?: string;
          genre_id?: number;
          genre_name: string;
        };
        Update: {
          created_at?: string;
          genre_id?: number;
          genre_name?: string;
        };
        Relationships: [];
      };
      z_genre_book: {
        Row: {
          book_id: number;
          created_at: string;
          genre_id: number;
          id: number;
        };
        Insert: {
          book_id: number;
          created_at?: string;
          genre_id: number;
          id?: number;
        };
        Update: {
          book_id?: number;
          created_at?: string;
          genre_id?: number;
          id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'genre_book_genre_id_fkey';
            columns: ['genre_id'];
            isOneToOne: false;
            referencedRelation: 'z_genre';
            referencedColumns: ['genre_id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      ReadStatus: 'WANT_TO_READ' | 'READING' | 'READ' | 'UNREAD';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
