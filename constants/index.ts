export interface Product {
	id: number;
	name: string;
	inStock: number;
	sellingPrice: number;
}

export interface WasteLog {
	id: string;
	productName: string;
	quantity: number;
	reason: string;
	costLost: number;
	wasteRate: number;
	aiSuggestion: string;
	date: string;
}

export interface Supplier {
	id: string;
	name: string;
	ingredient: string;
	prevPrice: number;
	currentPrice: number;
	percentIncrease: number;
	marginImpact: number;
}

export interface Product {
	id: number;
	name: string;
	inStock: number;
}

export interface PredictionResult {
	id: string; // Unique ID for each prediction card
	productName: string;
	avgDailySales: number;
	currentStock: number;
	nextWeekNeeded: number;
	isShortage: boolean;
}

export interface Product {
	id: number;
	name: string;
	inStock: number;
	sellingPrice: number;
	ingredients?: Ingredient[];
}

export interface Scenario {
	id: string;
	category: string;
	title: string;
	icon: React.ReactNode;
	priceImpactText: string;
	wasteImpactText: string;
	priceMod: number;
	wasteMod: number;
	riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
	specialAlert?: { title: string; text: string; type: "security" | "literacy" };
	recommendations: string[];
}

export interface SaleEntry {
	id: string;
	date: string;
	productId: number;
	productName: string;
	sellingPrice: number;
	quantitySold: number;
	revenue: number;
}

export interface Ingredient {
	id: string;
	name: string;
	quantity: number | string;
	unit: string;
	price: number | string;
}
