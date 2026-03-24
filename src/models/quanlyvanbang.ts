import { useEffect, useCallback, useState } from 'react';

export namespace QuanLyVanBang {
	export interface SoVanBang {
		id: string;
		nam: number;
		soHieuSo: string;
		ngayMo: number;
		soLuongVanBang: number;
		soLuongConLai: number;
		trangThai: 'dang_su_dung' | 'da_dong';
		ghiChu?: string;
		ngayTao?: number;
	}

	export interface QuyetDinhTotNghiep {
		id: string;
		soQuyetDinh: string;
		ngayBanHanh: string;
		trichYeu: string;
		idSoVanBang: string;
		soLuongSinhVienTotNghiep: number;
		trangThai: 'nhap' | 'hoat_dong' | 'da_ket_thuc';
		ghiChu?: string;
		ngayTao?: number;
	}

	export type KieuDuLieu = 'string' | 'number' | 'date' | 'select';

	export interface TruongThongTin {
		id: string;
		tenTruong: string;
		kieuDuLieu: KieuDuLieu;
		batBuoc: boolean;
		thuTu: number;
		options?: string[];
		ghiChu?: string;
		ngayTao?: number;
	}

	export interface BieuMauVanBang {
		id: string;
		tenBieuMau: string;
		moTa?: string;
		cacTruong: TruongThongTin[];
		ngayTao?: number;
		ngayCapNhat?: number;
	}

	export interface ThongTinVanBang {
		id: string;
		soVaoSo: number;
		soHieuVanBang: string;
		maSinhVien: string;
		hoTen: string;
		ngaySinh: string;
		idQuyetDinh: string;
		idSoVanBang: string;
		duLieuThemThem: Record<string, any>;
		trangThai: 'nhap' | 'hoan_thanh' | 'da_cap';
		ghiChu?: string;
		ngayTao?: number;
		ngayCapNhat?: number;
	}

	export interface TraCuuVanBang {
		id: string;
		soHieuVanBang?: string;
		soVaoSo?: number;
		maSinhVien?: string;
		hoTen?: string;
		ngaySinh?: string;
		idQuyetDinh?: string;
		ngayTraCuu: number;
	}

	export interface ThongKeTraCuu {
		idQuyetDinh: string;
		tongSoLuotTraCuu: number;
		ngayCapNhat: number;
	}

	export interface HeThongQuanLyVanBang {
		soVanBang: SoVanBang[];
		quyetDinh: QuyetDinhTotNghiep[];
		bieuMau: BieuMauVanBang[];
		vanBang: ThongTinVanBang[];
		traCuu: TraCuuVanBang[];
		thongKeTraCuu: ThongKeTraCuu[];
	}
}

const STORAGE_KEYS = {
	SO_VAN_BANG: 'van_bang_so_van_bang',
	QUYET_DINH: 'van_bang_quyet_dinh',
	BIEU_MAU: 'van_bang_bieu_mau',
	VAN_BANG: 'van_bang_thong_tin',
	TRA_CUU: 'van_bang_tra_cuu',
	THONG_KE_TRA_CUU: 'van_bang_thong_ke_tra_cuu',
	ALL_DATA: 'van_bang_all_data',
	LAST_SYNC: 'van_bang_last_sync',
};

class LocalStorageManager {
	saveSoVanBang(data: QuanLyVanBang.SoVanBang[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.SO_VAN_BANG, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu sổ văn bằng:', error);
			return false;
		}
	}

	loadSoVanBang(): QuanLyVanBang.SoVanBang[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.SO_VAN_BANG);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải sổ văn bằng:', error);
			return [];
		}
	}

	saveQuyetDinh(data: QuanLyVanBang.QuyetDinhTotNghiep[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.QUYET_DINH, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu quyết định:', error);
			return false;
		}
	}

	loadQuyetDinh(): QuanLyVanBang.QuyetDinhTotNghiep[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.QUYET_DINH);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải quyết định:', error);
			return [];
		}
	}

	saveBieuMau(data: QuanLyVanBang.BieuMauVanBang[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.BIEU_MAU, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu biểu mẫu:', error);
			return false;
		}
	}

	loadBieuMau(): QuanLyVanBang.BieuMauVanBang[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.BIEU_MAU);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải biểu mẫu:', error);
			return [];
		}
	}

	saveVanBang(data: QuanLyVanBang.ThongTinVanBang[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.VAN_BANG, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu văn bằng:', error);
			return false;
		}
	}

	loadVanBang(): QuanLyVanBang.ThongTinVanBang[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.VAN_BANG);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải văn bằng:', error);
			return [];
		}
	}

	saveTraCuu(data: QuanLyVanBang.TraCuuVanBang[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.TRA_CUU, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu tra cứu:', error);
			return false;
		}
	}

	loadTraCuu(): QuanLyVanBang.TraCuuVanBang[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.TRA_CUU);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải tra cứu:', error);
			return [];
		}
	}

	saveThongKeTraCuu(data: QuanLyVanBang.ThongKeTraCuu[]): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.THONG_KE_TRA_CUU, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu thống kê tra cứu:', error);
			return false;
		}
	}

	loadThongKeTraCuu(): QuanLyVanBang.ThongKeTraCuu[] {
		try {
			const data = localStorage.getItem(STORAGE_KEYS.THONG_KE_TRA_CUU);
			return data ? JSON.parse(data) : [];
		} catch (error) {
			console.error('Lỗi tải thống kê tra cứu:', error);
			return [];
		}
	}

	saveAllData(data: QuanLyVanBang.HeThongQuanLyVanBang): boolean {
		try {
			localStorage.setItem(STORAGE_KEYS.ALL_DATA, JSON.stringify(data));
			this.updateLastSync();
			return true;
		} catch (error) {
			console.error('Lỗi lưu toàn bộ dữ liệu:', error);
			return false;
		}
	}

	loadAllData(): QuanLyVanBang.HeThongQuanLyVanBang {
		try {
			return {
				soVanBang: this.loadSoVanBang(),
				quyetDinh: this.loadQuyetDinh(),
				bieuMau: this.loadBieuMau(),
				vanBang: this.loadVanBang(),
				traCuu: this.loadTraCuu(),
				thongKeTraCuu: this.loadThongKeTraCuu(),
			};
		} catch (error) {
			console.error('Lỗi tải toàn bộ dữ liệu:', error);
			return {
				soVanBang: [],
				quyetDinh: [],
				bieuMau: [],
				vanBang: [],
				traCuu: [],
				thongKeTraCuu: [],
			};
		}
	}

	updateLastSync(): void {
		localStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
	}

	getLastSync(): number {
		const lastSync = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
		return lastSync ? parseInt(lastSync, 10) : 0;
	}

	clearAllData(): boolean {
		try {
			Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
			return true;
		} catch (error) {
			console.error('Lỗi xóa toàn bộ dữ liệu:', error);
			return false;
		}
	}
}

const useDocumentManagementSystem = () => {
	const manager = new LocalStorageManager();
	const [soVanBang, setSoVanBang] = useState<QuanLyVanBang.SoVanBang[]>([]);
	const [quyetDinh, setQuyetDinh] = useState<QuanLyVanBang.QuyetDinhTotNghiep[]>([]);
	const [bieuMau, setBieuMau] = useState<QuanLyVanBang.BieuMauVanBang[]>([]);
	const [vanBang, setVanBang] = useState<QuanLyVanBang.ThongTinVanBang[]>([]);
	const [traCuu, setTraCuu] = useState<QuanLyVanBang.TraCuuVanBang[]>([]);
	const [thongKeTraCuu, setThongKeTraCuu] = useState<QuanLyVanBang.ThongKeTraCuu[]>([]);

	useEffect(() => {
		const data = manager.loadAllData();
		setSoVanBang(data.soVanBang);
		setQuyetDinh(data.quyetDinh);
		setBieuMau(data.bieuMau);
		setVanBang(data.vanBang);
		setTraCuu(data.traCuu);
		setThongKeTraCuu(data.thongKeTraCuu);
	}, []);

	const themSoVanBang = useCallback(
		(newSo: Omit<QuanLyVanBang.SoVanBang, 'id' | 'ngayTao'>): boolean => {
			try {
				const newData: QuanLyVanBang.SoVanBang = {
					...newSo,
					id: `so_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					ngayTao: Date.now(),
				};
				const updatedList = [...soVanBang, newData];
				setSoVanBang(updatedList);
				manager.saveSoVanBang(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi thêm sổ văn bằng:', error);
				return false;
			}
		},
		[soVanBang],
	);

	const capNhatSoVanBang = useCallback(
		(id: string, updates: Partial<QuanLyVanBang.SoVanBang>): boolean => {
			try {
				const updatedList = soVanBang.map((item) =>
					item.id === id ? { ...item, ...updates, ngayTao: item.ngayTao } : item,
				);
				setSoVanBang(updatedList);
				manager.saveSoVanBang(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi cập nhật sổ văn bằng:', error);
				return false;
			}
		},
		[soVanBang],
	);

	const xoaSoVanBang = useCallback(
		(id: string): boolean => {
			try {
				const updatedList = soVanBang.filter((item) => item.id !== id);
				setSoVanBang(updatedList);
				manager.saveSoVanBang(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi xóa sổ văn bằng:', error);
				return false;
			}
		},
		[soVanBang],
	);

	const themQuyetDinh = useCallback(
		(newQD: Omit<QuanLyVanBang.QuyetDinhTotNghiep, 'id' | 'ngayTao'>): boolean => {
			try {
				const newData: QuanLyVanBang.QuyetDinhTotNghiep = {
					...newQD,
					id: `qd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					ngayTao: Date.now(),
				};
				const updatedList = [...quyetDinh, newData];
				setQuyetDinh(updatedList);
				manager.saveQuyetDinh(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi thêm quyết định:', error);
				return false;
			}
		},
		[quyetDinh],
	);

	const capNhatQuyetDinh = useCallback(
		(id: string, updates: Partial<QuanLyVanBang.QuyetDinhTotNghiep>): boolean => {
			try {
				const updatedList = quyetDinh.map((item) =>
					item.id === id ? { ...item, ...updates, ngayTao: item.ngayTao } : item,
				);
				setQuyetDinh(updatedList);
				manager.saveQuyetDinh(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi cập nhật quyết định:', error);
				return false;
			}
		},
		[quyetDinh],
	);

	const xoaQuyetDinh = useCallback(
		(id: string): boolean => {
			try {
				const updatedList = quyetDinh.filter((item) => item.id !== id);
				setQuyetDinh(updatedList);
				manager.saveQuyetDinh(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi xóa quyết định:', error);
				return false;
			}
		},
		[quyetDinh],
	);

	const themBieuMau = useCallback(
		(newBM: Omit<QuanLyVanBang.BieuMauVanBang, 'id' | 'ngayTao'>): boolean => {
			try {
				const newData: QuanLyVanBang.BieuMauVanBang = {
					...newBM,
					id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					ngayTao: Date.now(),
				};
				const updatedList = [...bieuMau, newData];
				setBieuMau(updatedList);
				manager.saveBieuMau(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi thêm biểu mẫu:', error);
				return false;
			}
		},
		[bieuMau],
	);

	const capNhatBieuMau = useCallback(
		(id: string, updates: Partial<QuanLyVanBang.BieuMauVanBang>): boolean => {
			try {
				const updatedList = bieuMau.map((item) =>
					item.id === id ? { ...item, ...updates, ngayTao: item.ngayTao, ngayCapNhat: Date.now() } : item,
				);
				setBieuMau(updatedList);
				manager.saveBieuMau(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi cập nhật biểu mẫu:', error);
				return false;
			}
		},
		[bieuMau],
	);

	const xoaBieuMau = useCallback(
		(id: string): boolean => {
			try {
				const updatedList = bieuMau.filter((item) => item.id !== id);
				setBieuMau(updatedList);
				manager.saveBieuMau(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi xóa biểu mẫu:', error);
				return false;
			}
		},
		[bieuMau],
	);

	const themTruongThongTin = useCallback(
		(idBieuMau: string, truong: Omit<QuanLyVanBang.TruongThongTin, 'id' | 'ngayTao'>): boolean => {
			try {
				const newTruong: QuanLyVanBang.TruongThongTin = {
					...truong,
					id: `tt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					ngayTao: Date.now(),
				};
				const updatedList = bieuMau.map((item) =>
					item.id === idBieuMau
						? {
								...item,
								cacTruong: [...item.cacTruong, newTruong],
								ngayCapNhat: Date.now(),
						  }
						: item,
				);
				setBieuMau(updatedList);
				manager.saveBieuMau(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi thêm trường thông tin:', error);
				return false;
			}
		},
		[bieuMau],
	);

	const xoaTruongThongTin = useCallback(
		(idBieuMau: string, idTruong: string): boolean => {
			try {
				const updatedList = bieuMau.map((item) =>
					item.id === idBieuMau
						? {
								...item,
								cacTruong: item.cacTruong.filter((t) => t.id !== idTruong),
								ngayCapNhat: Date.now(),
						  }
						: item,
				);
				setBieuMau(updatedList);
				manager.saveBieuMau(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi xóa trường thông tin:', error);
				return false;
			}
		},
		[bieuMau],
	);

	const themVanBang = useCallback(
		(newVB: Omit<QuanLyVanBang.ThongTinVanBang, 'id' | 'soVaoSo' | 'ngayTao'>): boolean => {
			try {
				const soVBHienTai = soVanBang.find((s) => s.id === newVB.idSoVanBang);
				if (!soVBHienTai) {
					console.error('Không tìm thấy sổ văn bằng');
					return false;
				}

				const newData: QuanLyVanBang.ThongTinVanBang = {
					...newVB,
					id: `vb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					soVaoSo: soVBHienTai.soLuongVanBang + 1,
					ngayTao: Date.now(),
				};

				const updatedVanBang = [...vanBang, newData];
				setVanBang(updatedVanBang);
				manager.saveVanBang(updatedVanBang);

				const updatedSoVB = soVanBang.map((item) =>
					item.id === newVB.idSoVanBang
						? {
								...item,
								soLuongVanBang: item.soLuongVanBang + 1,
								soLuongConLai: item.soLuongConLai - 1,
						  }
						: item,
				);
				setSoVanBang(updatedSoVB);
				manager.saveSoVanBang(updatedSoVB);

				return true;
			} catch (error) {
				console.error('Lỗi thêm văn bằng:', error);
				return false;
			}
		},
		[vanBang, soVanBang],
	);

	const capNhatVanBang = useCallback(
		(id: string, updates: Partial<QuanLyVanBang.ThongTinVanBang>): boolean => {
			try {
				const updatedList = vanBang.map((item) =>
					item.id === id
						? {
								...item,
								...updates,
								soVaoSo: item.soVaoSo,
								ngayTao: item.ngayTao,
								ngayCapNhat: Date.now(),
						  }
						: item,
				);
				setVanBang(updatedList);
				manager.saveVanBang(updatedList);
				return true;
			} catch (error) {
				console.error('Lỗi cập nhật văn bằng:', error);
				return false;
			}
		},
		[vanBang],
	);

	const xoaVanBang = useCallback(
		(id: string): boolean => {
			try {
				const vanBangCanXoa = vanBang.find((item) => item.id === id);
				if (!vanBangCanXoa) return false;

				const updatedList = vanBang.filter((item) => item.id !== id);
				setVanBang(updatedList);
				manager.saveVanBang(updatedList);

				const updatedSoVB = soVanBang.map((item) =>
					item.id === vanBangCanXoa.idSoVanBang
						? {
								...item,
								soLuongVanBang: Math.max(0, item.soLuongVanBang - 1),
								soLuongConLai: item.soLuongConLai + 1,
						  }
						: item,
				);
				setSoVanBang(updatedSoVB);
				manager.saveSoVanBang(updatedSoVB);

				return true;
			} catch (error) {
				console.error('Lỗi xóa văn bằng:', error);
				return false;
			}
		},
		[vanBang, soVanBang],
	);

	const updateThongKeTraCuu = useCallback(
		(idQuyetDinh: string): void => {
			try {
				const existing = thongKeTraCuu.find((tk) => tk.idQuyetDinh === idQuyetDinh);
				let updatedList: QuanLyVanBang.ThongKeTraCuu[];

				if (existing) {
					updatedList = thongKeTraCuu.map((item) =>
						item.idQuyetDinh === idQuyetDinh
							? { ...item, tongSoLuotTraCuu: item.tongSoLuotTraCuu + 1, ngayCapNhat: Date.now() }
							: item,
					);
				} else {
					updatedList = [...thongKeTraCuu, { idQuyetDinh, tongSoLuotTraCuu: 1, ngayCapNhat: Date.now() }];
				}

				setThongKeTraCuu(updatedList);
				manager.saveThongKeTraCuu(updatedList);
			} catch (error) {
				console.error('Lỗi cập nhật thống kê tra cứu:', error);
			}
		},
		[thongKeTraCuu],
	);

	const traCuuVanBang = useCallback(
		(filters: Partial<QuanLyVanBang.TraCuuVanBang>): QuanLyVanBang.ThongTinVanBang[] => {
			try {
				let results = vanBang;

				if (filters.soHieuVanBang) {
					results = results.filter((vb) =>
						vb.soHieuVanBang.toLowerCase().includes(filters.soHieuVanBang!.toLowerCase()),
					);
				}

				if (filters.soVaoSo) {
					results = results.filter((vb) => vb.soVaoSo === filters.soVaoSo);
				}

				if (filters.maSinhVien) {
					results = results.filter((vb) => vb.maSinhVien.toLowerCase().includes(filters.maSinhVien!.toLowerCase()));
				}

				if (filters.hoTen) {
					results = results.filter((vb) => vb.hoTen.toLowerCase().includes(filters.hoTen!.toLowerCase()));
				}

				if (filters.ngaySinh) {
					results = results.filter((vb) => vb.ngaySinh === filters.ngaySinh);
				}

				if (filters.idQuyetDinh) {
					results = results.filter((vb) => vb.idQuyetDinh === filters.idQuyetDinh);
				}

				const newTraCuu: QuanLyVanBang.TraCuuVanBang = {
					id: `tc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
					...filters,
					ngayTraCuu: Date.now(),
				};
				const updatedTraCuu = [...traCuu, newTraCuu];
				setTraCuu(updatedTraCuu);
				manager.saveTraCuu(updatedTraCuu);

				if (filters.idQuyetDinh) {
					updateThongKeTraCuu(filters.idQuyetDinh);
				}

				return results;
			} catch (error) {
				console.error('Lỗi tra cứu văn bằng:', error);
				return [];
			}
		},
		[vanBang, traCuu],
	);
	return {
		soVanBang,
		quyetDinh,
		bieuMau,
		vanBang,
		traCuu,
		thongKeTraCuu,

		themSoVanBang,
		capNhatSoVanBang,
		xoaSoVanBang,

		themQuyetDinh,
		capNhatQuyetDinh,
		xoaQuyetDinh,

		themBieuMau,
		capNhatBieuMau,
		xoaBieuMau,
		themTruongThongTin,
		xoaTruongThongTin,

		themVanBang,
		capNhatVanBang,
		xoaVanBang,

		traCuuVanBang,
	};
};

export default useDocumentManagementSystem;
