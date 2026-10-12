import { FeaturesContent } from '@/app/admin/content-editor/page'
import { Plus, X } from 'lucide-react'

interface FeaturesEditorProps {
  content: FeaturesContent
  onChange: (content: FeaturesContent) => void
}

export default function FeaturesEditor({ content, onChange }: FeaturesEditorProps) {
  const handleTitleChange = (value: string) => {
    onChange({ ...content, title: value })
  }

  const handleDescriptionChange = (value: string) => {
    onChange({ ...content, description: value })
  }

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...content.features]
    newFeatures[index] = { ...newFeatures[index], [field]: value }
    onChange({ ...content, features: newFeatures })
  }

  const addFeature = () => {
    const newFeature = { title: '', description: '', icon: '⭐' }
    onChange({ ...content, features: [...content.features, newFeature] })
  }

  const removeFeature = (index: number) => {
    onChange({ ...content, features: content.features.filter((_, i) => i !== index) })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Section Title</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Section Description</label>
        <textarea
          value={content.description}
          onChange={(e) => handleDescriptionChange(e.target.value)}
          rows={2}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Features */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Features</h3>
          <button
            onClick={addFeature}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Feature
          </button>
        </div>

        <div className="space-y-4">
          {content.features.map((feature, index) => (
            <div key={index} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Icon (emoji)</label>
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => handleFeatureChange(index, 'icon', e.target.value.slice(0, 2))}
                    maxLength={2}
                    className="w-24 px-4 py-2 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                </div>
                <button
                  onClick={() => removeFeature(index)}
                  className="p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Feature Title</label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  value={feature.description}
                  onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
