import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import CategoryForm from "@/components/category-form"
import DeleteCategoryButton from "@/components/delete-category-button"

export default async function CategoriesPage() {
  const supabase = createClient()

  // Get all categories
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading font-black text-3xl text-slate-900">Categories</h1>
        <p className="font-body text-slate-600 mt-2">Organize your content with categories.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add New Category */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-xl text-slate-900">Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>

        {/* Categories List */}
        <Card className="border border-slate-200">
          <CardHeader>
            <CardTitle className="font-heading font-bold text-xl text-slate-900">All Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories && categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-body font-semibold text-slate-900">{category.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{category.description}</p>
                      <p className="text-xs text-slate-500 mt-1">Slug: {category.slug}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-slate-400" />
                </div>
                <p className="font-body text-slate-600">
                  No categories yet. Create your first category to get started!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
