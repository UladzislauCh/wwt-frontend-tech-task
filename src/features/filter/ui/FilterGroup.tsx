import { FilterItem } from '@/shared/api/types/Filter'
import { cn } from '@/shared/lib/cn'
import { Checkbox } from '@/shared/ui/Checkbox'

import { ColumnCount, getColumnCount } from '../model/columns'

// Full class names are listed so Tailwind can find them in the source.
// On phones every group is a single column, wide layouts get the column count from the design
const GRID_COLUMNS_CLASSES: Record<ColumnCount, string> = {
	1: 'grid-cols-1',
	2: 'grid-cols-1 sm:grid-cols-2',
	3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
}

interface FilterGroupProps {
	filterItem: FilterItem
	selectedOptionIds: string[]
	onToggle: (optionId: string) => void
}

export const FilterGroup = ({
	filterItem,
	selectedOptionIds,
	onToggle
}: FilterGroupProps) => (
	<fieldset>
		<legend className="mb-6 text-2xl leading-none font-medium">
			{filterItem.name}
		</legend>

		<div
			className={cn(
				'grid gap-x-8 gap-y-4',
				GRID_COLUMNS_CLASSES[getColumnCount(filterItem.options.length)]
			)}
		>
			{filterItem.options.map(option => (
				<Checkbox
					key={option.id}
					name={filterItem.id}
					value={option.id}
					label={option.name}
					checked={selectedOptionIds.includes(option.id)}
					onChange={() => onToggle(option.id)}
				/>
			))}
		</div>
	</fieldset>
)
