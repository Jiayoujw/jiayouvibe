import type { Tutorial } from '@/types'
import TutorialCard from '@/components/development/TutorialCard'
import EmptyState from '@/components/ui/EmptyState'
import { BookOpen } from 'lucide-react'

interface TutorialGridProps {
  tutorials: Tutorial[]
}

export default function TutorialGrid({ tutorials }: TutorialGridProps) {
  if (tutorials.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen className="w-12 h-12" />}
        title="没有找到教程"
        description="尝试调整筛选条件，或清除过滤查看全部内容"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {tutorials.map((tutorial) => (
        <TutorialCard key={tutorial.slug} tutorial={tutorial} />
      ))}
    </div>
  )
}
