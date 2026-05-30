import type { AIModel } from '@/types'
import ModelCard from '@/components/models/ModelCard'

interface ModelGridProps {
  models: AIModel[]
}

const ModelGrid = ({ models }: ModelGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {models.map((model) => (
        <ModelCard key={model.slug} model={model} />
      ))}
    </div>
  )
}

export default ModelGrid
