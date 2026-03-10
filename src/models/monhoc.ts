import { useState, useEffect } from 'react';

export interface monhoc {
	id: number;
	tenMonHoc: string;
}

const STORAGE_KEY = 'monHoc_data';

const loadFromStorage = (): monhoc[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const result = JSON.parse(stored);
			console.log('📚 Load môn học từ localStorage:', result.length, 'items');
			return result;
		}
	} catch (error) {
		console.error('lỗi khi tải dữ liệu từ localstorage:', error);
	}
	console.log('⚠️ Không có dữ liệu môn học trong localStorage');
	return [];
};

export const useMonHocModel = () => {
	const [monHoc, setMonHoc] = useState<monhoc[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(monHoc));
			console.log('✅ Đã lưu môn học vào localStorage:', monHoc.length, 'items');
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [monHoc]);

	const themMonHoc = (ten: string) => {
		const newMon: monhoc = {
			id: Date.now(),
			tenMonHoc: ten,
		};
		setMonHoc((prev) => [...prev, newMon]);
	};

	const suaMonHoc = (id: number, ten: string) => {
		setMonHoc((prev) => prev.map((mon) => (mon.id === id ? { ...mon, tenMonHoc: ten } : mon)));
	};

	const xoaMonHoc = (id: number) => {
		setMonHoc((prev) => prev.filter((mon) => mon.id !== id));
	};

	const refreshMonHoc = () => {
		setMonHoc(loadFromStorage());
	};

	return {
		monHoc,
		themMonHoc,
		suaMonHoc,
		xoaMonHoc,
		refreshMonHoc,
	};
};
