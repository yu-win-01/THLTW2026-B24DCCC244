import { useCallback, useState, useEffect } from 'react';
import { message } from 'antd';
import { Id } from 'react-beautiful-dnd';
import type { OrderProduct } from './donhang';

export interface product {
	id: number;
	name: string;
	category: string;
	price: number;
	quantity: number;
}

const STORAGE_KEY = 'sanPham_data';

const defaultData: product[] = [
	{ id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
	{ id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
	{ id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
	{ id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
	{ id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
	{ id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
	{ id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
	{ id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 },
];

const loadFromStorage = (): product[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (error) {
		console.error('lỗi khi tải dữ liệu từ localstorage:', error);
	}
	return defaultData;
};

export default () => {
	const [sanPham, sanPhamList] = useState<product[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(sanPham));
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [sanPham]);
	const maxId = sanPham.length > 0 ? Math.max(...sanPham.map((item) => item.id)) + 1 : 0;
	const [maxIdState, setMaxIdState] = useState<number>(maxId);
	const addSanPham = useCallback(
		(Item: product) => {
			Item.id = maxIdState;
			const newSanPham = { ...Item };
			sanPhamList([...sanPham, newSanPham]);
			setMaxIdState((prev) => prev + 1);
		},
		[sanPham, maxIdState],
	);
	const truTonKho = (products: OrderProduct[]) => {
		sanPhamList((prev) =>
			prev.map((sp) => {
				const item = products.find((p) => p.productId === sp.id);
				if (!item) return sp;

				return {
					...sp,
					quantity: sp.quantity - item.quantity,
				};
			}),
		);
	};
	return {
		sanPham,
		sanPhamList,
		addSanPham,
		truTonKho,
	};
};
