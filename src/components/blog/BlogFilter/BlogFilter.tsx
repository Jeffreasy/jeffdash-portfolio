'use client'

import type { BlogTag } from '@/types/blog'

interface BlogFilterProps {
  categories: {
    id: string
    name: string
    slug: string
    description: string | null
    created_at: string
  }[]
  tags: BlogTag[]
  selectedCategory: string | null
  selectedTags: string[]
  onCategoryChange: (categoryId: string | null) => void
  onTagChange: (tagId: string) => void
}

export function BlogFilter({
  categories,
  tags,
  selectedCategory,
  selectedTags,
  onCategoryChange,
  onTagChange,
}: BlogFilterProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Categorieën</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            Alle
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === category.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => onTagChange(tag.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
