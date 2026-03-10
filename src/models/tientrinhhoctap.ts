import { useState, useEffect } from 'react';

export interface tientrinhmonhoc {
	id: number;
	subjectId: number;
	Datetime: string;
	ngayhoc: Date;
	thoiLuongHoc: number;
	noiDungDaHoc: string;
	ghiChu: string;
	hoanThanh: boolean;
}

const STORAGE_KEY = 'tientrinhmonhoc_data';

const loadFromStorage = (): tientrinhmonhoc[] => {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const data = JSON.parse(stored);
			const result = data.map((item: any) => ({
				...item,
				noiDungDaHoc: item.noiDungDaHoc || item.ghiChu || '',
				ghiChu: item.ghiChu || '',
				ngayhoc: item.ngayhoc || item.Datetime || new Date().toISOString(),
			}));
			console.log('📚 Load tiến trình học tập từ localStorage:', result.length, 'items');
			return result;
		}
	} catch (error) {
		console.error('lỗi khi tải dữ liệu từ localstorage:', error);
	}
	console.log('⚠️ Không có dữ liệu tiến trình học tập trong localStorage');
	return [];
};

export const useTienTrinhMonHocModel = () => {
	const [tienTrinhMonHoc, setTienTrinhMonHoc] = useState<tientrinhmonhoc[]>(loadFromStorage());

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(tienTrinhMonHoc));
			console.log('✅ Đã lưu tiến trình học tập vào localStorage:', tienTrinhMonHoc.length, 'items');
		} catch (error) {
			console.error('lưu dữ liệu trên localstorage thất bại:', error);
		}
	}, [tienTrinhMonHoc]);

	const themTienTrinhMonHoc = (
		subjectId: number,
		thoiLuongHoc: number,
		noiDungDaHoc: string,
		ghiChu: string,
		ngayhoc: Date,
	) => {
		const newTienTrinh: tientrinhmonhoc = {
			id: Date.now(),
			subjectId,
			Datetime: new Date().toISOString(),
			ngayhoc,
			thoiLuongHoc,
			noiDungDaHoc,
			ghiChu,
			hoanThanh: false,
		};
		console.log('\u2795 Th\u00eam ti\u1ebfn tr\u00ecnh m\u1edbi:', newTienTrinh);
		setTienTrinhMonHoc((prev) => [...prev, newTienTrinh]);

		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const capNhatTrangThai = (id: number, hoanThanh: boolean) => {
		setTienTrinhMonHoc((prev) => prev.map((item) => (item.id === id ? { ...item, hoanThanh } : item)));

		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const suaTienTrinhMonHoc = (
		id: number,
		thoiLuongHoc: number,
		noiDungDaHoc: string,
		ghiChu: string,
		ngayhoc: Date,
	) => {
		console.log('\u270f\ufe0f S\u1eeda ti\u1ebfn tr\u00ecnh ID:', id);
		setTienTrinhMonHoc((prev) =>
			prev.map((item) => (item.id === id ? { ...item, thoiLuongHoc, noiDungDaHoc, ghiChu, ngayhoc } : item)),
		);
		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const xoaTienTrinhMonHoc = (id: number) => {
		console.log('\u274c X\u00f3a ti\u1ebfn tr\u00ecnh ID:', id);
		setTienTrinhMonHoc((prev) => prev.filter((tienTrinh) => tienTrinh.id !== id));
		window.dispatchEvent(new CustomEvent('tientrinhmonhoc-updated'));
	};

	const refreshTienTrinhMonHoc = () => {
		const freshData = loadFromStorage();
		console.log('🔄 Refresh tiến trình học tập từ localStorage:', freshData.length, 'items');
		setTienTrinhMonHoc(freshData);
	};

	return {
		tienTrinhMonHoc,
		themTienTrinhMonHoc,
		capNhatTrangThai,
		suaTienTrinhMonHoc,
		xoaTienTrinhMonHoc,
		refreshTienTrinhMonHoc,
	};
};
