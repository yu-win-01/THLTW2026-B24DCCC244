import { useEffect, useCallback, useState } from 'react';

export namespace LichHeThong {
	export interface DichVu {
		id: string;
		ten: string;
		moTa: string;
		gia: number;
		khoangThoiGian: number;
		danhMuc: string;
		ngayTao?: number;
	}

	export interface GioLamViec {
		ngayTrongTuan: number;
		gioBatDau: string;
		gioKetThuc: string;
	}

	export interface NhanVien {
		id: string;
		ten: string;
		email: string;
		dienThoai: string;
		dichVu: string[];
		soLichHenToiDaTrongNgay: number;
		gioLamViec: GioLamViec[];
		dangHoatDong: boolean;
		ngayTao?: number;
	}

	export interface LichHen {
		id: string;
		tenKhachHang: string;
		emailKhachHang: string;
		dienThoaiKhachHang: string;
		idKhachHang?: string;
		idDichVu: string;
		idNhanVien: string;
		ngayLichHen: string;
		gioLichHen: string;
		khoangThoiGian: number;
		trangThai: 'cho_xu_ly' | 'da_xac_nhan' | 'hoan_thanh' | 'da_huy';
		ghiChu?: string;
		danhGia?: boolean;
		ngayTao?: number;
	}

	export interface DanhGiaLichHen {
		id: string;
		idLichHen: string;
		diemDanhGia: number;
		binhLuan: string;
		phanHoiNhanVien?: string;
		ngayTao?: number;
	}

	export interface HeThongLichHen {
		dichVu: DichVu[];
		nhanVien: NhanVien[];
		lichHen: LichHen[];
		danhGia: DanhGiaLichHen[];
	}

	export interface KiemTraXungDot {
		coXungDot: boolean;
		liChiTiet?: string;
	}

	export interface GioTrong {
		gio: string;
		khan: boolean;
	}
}

const STORAGE_KEYS = {
	DICH_VU: 'lich_he_thong_dich_vu',
	NHAN_VIEN: 'lich_he_thong_nhan_vien',
	LICH_HEN: 'lich_he_thong_lich_hen',
	DANH_GIA: 'lich_he_thong_danh_gia',
	ALL_DATA: 'lich_he_thong_all_data',
	LAST_SYNC: 'lich_he_thong_last_sync',
};

class LocalStorageManager {
	saveDichVu(data: LichHeThong.DichVu[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.DICH_VU, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu dịch vụ:', error);
			return false;
		}
	}

	loadDichVu(): LichHeThong.DichVu[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.DICH_VU);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải dịch vụ:', error);
			return [];
		}
	}

	saveNhanVien(data: LichHeThong.NhanVien[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.NHAN_VIEN, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu nhân viên:', error);
			return false;
		}
	}

	loadNhanVien(): LichHeThong.NhanVien[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.NHAN_VIEN);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải nhân viên:', error);
			return [];
		}
	}

	saveLichHen(data: LichHeThong.LichHen[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.LICH_HEN, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu lịch hẹn:', error);
			return false;
		}
	}

	loadLichHen(): LichHeThong.LichHen[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.LICH_HEN);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải lịch hẹn:', error);
			return [];
		}
	}

	saveDanhGia(data: LichHeThong.DanhGiaLichHen[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.DANH_GIA, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu đánh giá:', error);
			return false;
		}
	}

	loadDanhGia(): LichHeThong.DanhGiaLichHen[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.DANH_GIA);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải đánh giá:', error);
			return [];
		}
	}

	saveAllData(data: LichHeThong.HeThongLichHen): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.ALL_DATA, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu toàn bộ dữ liệu:', error);
			return false;
		}
	}

	loadAllData(): LichHeThong.HeThongLichHen {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.ALL_DATA);
			return data
				? JSON.parse(data)
				: {
						dichVu: [],
						nhanVien: [],
						lichHen: [],
						danhGia: [],
				  };
		} catch (error) {
			console.error('Lỗi tải toàn bộ dữ liệu:', error);
			return {
				dichVu: [],
				nhanVien: [],
				lichHen: [],
				danhGia: [],
			};
		}
	}

	saveData<T extends keyof LichHeThong.HeThongLichHen>(type: T, data: LichHeThong.HeThongLichHen[T]): boolean {
		switch (type) {
			case 'dichVu':
				return this.saveDichVu(data as LichHeThong.DichVu[]);
			case 'nhanVien':
				return this.saveNhanVien(data as LichHeThong.NhanVien[]);
			case 'lichHen':
				return this.saveLichHen(data as LichHeThong.LichHen[]);
			case 'danhGia':
				return this.saveDanhGia(data as LichHeThong.DanhGiaLichHen[]);
			default:
				return false;
		}
	}

	loadData<T extends keyof LichHeThong.HeThongLichHen>(type: T): LichHeThong.HeThongLichHen[T] {
		switch (type) {
			case 'dichVu':
				return this.loadDichVu() as LichHeThong.HeThongLichHen[T];
			case 'nhanVien':
				return this.loadNhanVien() as LichHeThong.HeThongLichHen[T];
			case 'lichHen':
				return this.loadLichHen() as LichHeThong.HeThongLichHen[T];
			case 'danhGia':
				return this.loadDanhGia() as LichHeThong.HeThongLichHen[T];
			default:
				return [] as any;
		}
	}

	clearData(type?: 'dichVu' | 'nhanVien' | 'lichHen' | 'danhGia' | 'all'): boolean {
		try {
			if (type === 'all') {
				Object.values(STORAGE_KEYS).forEach((key) => {
					localStorage.removeItem(key);
				});
				return true;
			}

			const key = STORAGE_KEYS[`${type!.toUpperCase()}` as keyof typeof STORAGE_KEYS];
			if (key) {
				localStorage.removeItem(key);
				this.updateLastSync();
				return true;
			}
			return false;
		} catch (error) {
			console.error('Lỗi xóa dữ liệu:', error);
			return false;
		}
	}

	hasData(type: 'dichVu' | 'nhanVien' | 'lichHen' | 'danhGia'): boolean {
		const key = STORAGE_KEYS[`${type.toUpperCase()}` as keyof typeof STORAGE_KEYS];
		return localStorage.getItem(key) !== null;
	}

	getLastSync(): number | null {
		try {
			const value = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
			return value ? parseInt(value, 10) : null;
		} catch {
			return null;
		}
	}

	private updateLastSync(): void {
		try {
			localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
		} catch (error) {
			console.error('Lỗi cập nhật thời gian đồng bộ:', error);
		}
	}

	exportData(): string {
		try {
			const data = this.loadAllData();
			return JSON.stringify(data, null, 2);
		} catch (error) {
			console.error('Lỗi xuất dữ liệu:', error);
			return '';
		}
	}

	importData(jsonData: string): boolean {
		try {
			const data = JSON.parse(jsonData) as LichHeThong.HeThongLichHen;
			return this.saveAllData(data);
		} catch (error) {
			console.error('Lỗi nhập dữ liệu:', error);
			return false;
		}
	}

	getStorageSize(): number {
		let size = 0;
		Object.values(STORAGE_KEYS).forEach((key) => {
			const item = localStorage.getItem(key);
			if (item) {
				size += item.length;
			}
		});
		return size;
	}

	printStorageStats(): void {
		console.table({
			'Dịch vụ': this.loadDichVu().length,
			'Nhân viên': this.loadNhanVien().length,
			'Lịch hẹn': this.loadLichHen().length,
			'Đánh giá': this.loadDanhGia().length,
			'Kích thước (bytes)': this.getStorageSize(),
			'Lần đồng bộ cuối': new Date(this.getLastSync() || 0).toLocaleString('vi-VN'),
		});
	}
}

const appointmentStorage = new LocalStorageManager();
export { appointmentStorage, LocalStorageManager, STORAGE_KEYS };

export const useDichVuStorage = () => {
	const loadDichVu = useCallback(() => {
		return appointmentStorage.loadDichVu();
	}, []);

	const saveDichVu = useCallback((data: LichHeThong.DichVu[]) => {
		return appointmentStorage.saveDichVu(data);
	}, []);

	const clearDichVu = useCallback(() => {
		return appointmentStorage.clearData('dichVu');
	}, []);

	return { loadDichVu, saveDichVu, clearDichVu };
};

export const useNhanVienStorage = () => {
	const loadNhanVien = useCallback(() => {
		return appointmentStorage.loadNhanVien();
	}, []);

	const saveNhanVien = useCallback((data: LichHeThong.NhanVien[]) => {
		return appointmentStorage.saveNhanVien(data);
	}, []);

	const clearNhanVien = useCallback(() => {
		return appointmentStorage.clearData('nhanVien');
	}, []);

	return { loadNhanVien, saveNhanVien, clearNhanVien };
};

export const useLichHenStorage = () => {
	const loadLichHen = useCallback(() => {
		return appointmentStorage.loadLichHen();
	}, []);

	const saveLichHen = useCallback((data: LichHeThong.LichHen[]) => {
		return appointmentStorage.saveLichHen(data);
	}, []);

	const clearLichHen = useCallback(() => {
		return appointmentStorage.clearData('lichHen');
	}, []);

	return { loadLichHen, saveLichHen, clearLichHen };
};

export const useDanhGiaStorage = () => {
	const loadDanhGia = useCallback(() => {
		return appointmentStorage.loadDanhGia();
	}, []);

	const saveDanhGia = useCallback((data: LichHeThong.DanhGiaLichHen[]) => {
		return appointmentStorage.saveDanhGia(data);
	}, []);

	const clearDanhGia = useCallback(() => {
		return appointmentStorage.clearData('danhGia');
	}, []);

	return { loadDanhGia, saveDanhGia, clearDanhGia };
};

export const useAppointmentSystemStorage = () => {
	const loadAllData = useCallback(() => {
		return appointmentStorage.loadAllData();
	}, []);

	const saveAllData = useCallback((data: LichHeThong.HeThongLichHen) => {
		return appointmentStorage.saveAllData(data);
	}, []);

	const clearAllData = useCallback(() => {
		return appointmentStorage.clearData('all');
	}, []);

	const exportData = useCallback(() => {
		return appointmentStorage.exportData();
	}, []);

	const importData = useCallback((jsonData: string) => {
		return appointmentStorage.importData(jsonData);
	}, []);

	const getLastSync = useCallback(() => {
		return appointmentStorage.getLastSync();
	}, []);

	const getStorageSize = useCallback(() => {
		return appointmentStorage.getStorageSize();
	}, []);

	return {
		loadAllData,
		saveAllData,
		clearAllData,
		exportData,
		importData,
		getLastSync,
		getStorageSize,
	};
};

export const useAppointmentStorage = <T extends keyof LichHeThong.HeThongLichHen>(type: T) => {
	const load = useCallback(() => {
		return appointmentStorage.loadData(type);
	}, [type]);

	const save = useCallback(
		(data: LichHeThong.HeThongLichHen[T]) => {
			return appointmentStorage.saveData(type, data);
		},
		[type],
	);

	const clear = useCallback(() => {
		return appointmentStorage.clearData(type as any);
	}, [type]);

	const has = useCallback(() => {
		return appointmentStorage.hasData(type as any);
	}, [type]);

	return { load, save, clear, has };
};

export const useAutoSaveStorage = <T extends keyof LichHeThong.HeThongLichHen>(
	data: LichHeThong.HeThongLichHen[T],
	type: T,
	delay: number = 1000,
) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			appointmentStorage.saveData(type, data);
		}, delay);

		return () => clearTimeout(timer);
	}, [data, type, delay]);
};

export const useStorageListener = <T extends keyof LichHeThong.HeThongLichHen>(
	type: T,
	callback: (data: LichHeThong.HeThongLichHen[T]) => void,
) => {
	useEffect(() => {
		const handleStorageChange = (e: StorageEvent) => {
			const key = STORAGE_KEYS[`${type.toUpperCase()}` as keyof typeof STORAGE_KEYS];
			if (e.key === key) {
				const data = appointmentStorage.loadData(type);
				callback(data);
			}
		};

		window.addEventListener('storage', handleStorageChange);
		return () => window.removeEventListener('storage', handleStorageChange);
	}, [type, callback]);
};

const useAppointmentSystem = () => {
	const [danhGia] = useState<LichHeThong.DanhGiaLichHen[]>([]);
	const [dichVu] = useState<LichHeThong.DichVu[]>([]);
	const [nhanVien] = useState<LichHeThong.NhanVien[]>([]);
	const [lichHen] = useState<LichHeThong.LichHen[]>([]);

	const themDichVu = (data: any) => {};
	const capNhatDichVu = (id: string, data: any) => {};
	const xoaDichVu = (id: string) => {};

	const themNhanVien = (data: any) => {};
	const capNhatNhanVien = (id: string, data: any) => {};
	const xoaNhanVien = (id: string) => {};

	const themLichHen = (data: any) => true;
	const capNhatLichHen = (id: string, data: any) => {};
	const capNhatTrangThaiLichHen = (id: string, trangThai: any) => {};
	const xoaLichHen = (id: string) => {};
	const layGioTrong = (idNhanVien: string, ngay: string, duration: number) => [];
	const kiemTraXungDot = (idNhanVien: string, ngay: string, gio: string, duration: number) => false;

	const themDanhGia = (idLichHen: string, data: any) => {};
	const themPhanHoiNhanVien = (idDanhGia: string, phanHoi: string) => {};

	return {
		danhGia,
		dichVu,
		nhanVien,
		lichHen,
		themDichVu,
		capNhatDichVu,
		xoaDichVu,
		themNhanVien,
		capNhatNhanVien,
		xoaNhanVien,
		themLichHen,
		capNhatLichHen,
		capNhatTrangThaiLichHen,
		xoaLichHen,
		layGioTrong,
		kiemTraXungDot,
		themDanhGia,
		themPhanHoiNhanVien,
	};
};

export const CheatSheet = {
	saveDichVu: (data: LichHeThong.DichVu[]) => appointmentStorage.saveDichVu(data),
	saveNhanVien: (data: LichHeThong.NhanVien[]) => appointmentStorage.saveNhanVien(data),
	saveLichHen: (data: LichHeThong.LichHen[]) => appointmentStorage.saveLichHen(data),
	saveDanhGia: (data: LichHeThong.DanhGiaLichHen[]) => appointmentStorage.saveDanhGia(data),

	loadDichVu: () => appointmentStorage.loadDichVu(),
	loadNhanVien: () => appointmentStorage.loadNhanVien(),
	loadLichHen: () => appointmentStorage.loadLichHen(),
	loadDanhGia: () => appointmentStorage.loadDanhGia(),

	clearDichVu: () => appointmentStorage.clearData('dichVu'),
	clearNhanVien: () => appointmentStorage.clearData('nhanVien'),
	clearLichHen: () => appointmentStorage.clearData('lichHen'),
	clearDanhGia: () => appointmentStorage.clearData('danhGia'),
	clearAll: () => appointmentStorage.clearData('all'),

	hasData: (type: string) => appointmentStorage.hasData(type as any),
	getLastSync: () => appointmentStorage.getLastSync(),
	getStorageSize: () => appointmentStorage.getStorageSize(),
	printStats: () => appointmentStorage.printStorageStats(),

	exportData: () => appointmentStorage.exportData(),
	importData: (json: string) => appointmentStorage.importData(json),
};

export default useAppointmentSystem;
