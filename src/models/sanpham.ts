import { useCallback, useState } from 'react';
import { message } from 'antd';
export interface product {
	id: number;
	name: string;
	price: number;
	quantity: number;
}

export default () => {
	const [sanPham, sanPhamList] = useState<product[]>([
		{ id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },

		{ id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },

		{ id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },

		{ id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },

		{ id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
	]);
	const addSanPham = useCallback((Item: Omit<product, 'id'>) => {
		const maxId = sanPham.length > 0 ? Math.max(...sanPham.map((item) => item.id)) : 0;

		const newSanPham: product = {
			id: maxId + 1,
			...Item,
		};
		sanPhamList((prev) => [...prev, newSanPham]);
	}, []);
	return {
		sanPham,
		sanPhamList,
		addSanPham,
	};
};
