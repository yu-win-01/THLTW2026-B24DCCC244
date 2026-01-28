import { useCallback, useState, useEffect } from 'react';

export interface OrderProduct {
	productId: number;
	productName: string;
	quantity: number;
	price: number;
}

export interface Order {
	id: string;
	customerName: string;
	phone: string;
	address: string;
	products: OrderProduct[];
	totalAmount: number;
	status: string;
	createdAt: string;
}

const STORAGE_KEY = 'donhang_data';

const defaultData: Order[] = [
	{
		id: 'DH001',
		customerName: 'Nguyễn Văn A',
		phone: '0912345678',
		address: '123 Nguyễn Huệ, Q1, TP.HCM',
		products: [
			{
				productId: 1,
				productName: 'Laptop Dell XPS 13',
				quantity: 1,
				price: 25000000,
			},
		],
		totalAmount: 25000000,
		status: 'Chờ xử lý',
		createdAt: '2024-01-15',
	},
];

const loadFromStorage = (): Order[] => {
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

const useDonHangModel = () => {
	const [donhang, setDonhang] = useState<Order[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(donhang));
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [donhang]);

	const maxId =
		donhang.length > 0 ? Math.max(...donhang.map((item) => parseInt(item.id.replace('DH', ''), 10))) + 1 : 1;
	const [maxIdState, setMaxIdState] = useState(maxId);

	const addDonHang = useCallback(
		(item: Order) => {
			item.id = `DH${maxIdState.toString().padStart(3, '0')}`;
			const newDonHang = { ...item };
			setDonhang([...donhang, newDonHang]);
			setMaxIdState((prev) => prev + 1);
		},
		[donhang, maxIdState],
	);

	const tongTien = (products: OrderProduct[]) =>
		products
			.filter((i) => i && i.price !== undefined && i.quantity !== undefined)
			.reduce((t, i) => t + i.price * i.quantity, 0);

	const tongDonHang = (products: OrderProduct[]) => products.length;

	return {
		donhang,
		setDonhang,
		addDonHang,
		tongTien,
		tongDonHang,
	};
};

export type DonHangModelType = ReturnType<typeof useDonHangModel>;
export default useDonHangModel;
