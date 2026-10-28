export type ColumnCount = 1 | 2 | 3

// Rule from the layout: small groups shouldn't stretch into one sparse row,
// so 2 options go in a column and 4 options form a 2×2 grid
export const getColumnCount = (optionsCount: number): ColumnCount => {
	if (optionsCount <= 2) {
		return 1
	}

	if (optionsCount === 4) {
		return 2
	}

	return 3
}
