import path from 'path';

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/he-thong-quan-li-nhan-vien-va-dich-vu',
		name: 'Hệ thống quản lí nhân viên và dịch vụ',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-quan-li-nhan-vien-va-dich-vu/dat-lich-hen',
				name: 'Đặt lịch hẹn',
				component: './HeThongQuanLiNhanVienVaDichVu/DatLichHen',
			},
			{
				path: '/he-thong-quan-li-nhan-vien-va-dich-vu/lich-hen',
				name: 'Quản lý lịch hẹn',
				component: './HeThongQuanLiNhanVienVaDichVu/LichHen',
			},
			{
				path: '/he-thong-quan-li-nhan-vien-va-dich-vu/dich-vu',
				name: 'Dịch vụ',
				component: './HeThongQuanLiNhanVienVaDichVu/DichVu',
			},
			{
				path: '/he-thong-quan-li-nhan-vien-va-dich-vu/quan-ly-nhan-vien',
				name: 'Quản lý nhân viên',
				component: './HeThongQuanLiNhanVienVaDichVu/QuanLyNhanVien',
			},
			{
				path: '/he-thong-quan-li-nhan-vien-va-dich-vu/thong-ke',
				name: 'Thống kê',
				component: './HeThongQuanLiNhanVienVaDichVu/Thongke',
			},
		],
	},
	{
		path: '/he-thong-quan-li-cau-lac-bo',
		name: 'Hệ thống quản lí câu lạc bộ',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-quan-li-cau-lac-bo/danh-sach-cau-lac-bo',
				name: 'Danh sách câu lạc bộ',
				component: './HeThongQuanLiCauLacBo/DanhSachCauLacBo',
			},
			{
				path: '/he-thong-quan-li-cau-lac-bo/quan-ly-don-dang-ky-thanh-vien',
				name: 'Quản lý đơn đăng ký thành viên',
				component: './HeThongQuanLiCauLacBo/QuanLyDonDangKyThanhVien',
			},
			{
				path: '/he-thong-quan-li-cau-lac-bo/quan-ly-thanh-vien-cua-clb',
				name: 'Quản lý thành viên của câu lạc bộ',
				component: './HeThongQuanLiCauLacBo/QuanLyThanhVienCuaCLB',
			},
			{
				path: '/he-thong-quan-li-cau-lac-bo/bao-cao-thong-ke-hoat-dong-clb',
				name: 'Báo cáo thống kê hoạt động câu lạc bộ',
				component: './HeThongQuanLiCauLacBo/BaoCaoThongKeHoatDongCLB',
			},
		],
	},
	{
		path: '/he-thong-quan-li-van-bang-to-nghiep',
		name: 'Hệ thống quản lí văn bằng tốt nghiệp',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-quan-li-van-bang-to-nghiep/cau-hinh-bieu-mau',
				name: 'Cấu hình biểu mẫu',
				component: './HeThongQuanLiVaBangTotNghiep/CauHinhBieuMau',
			},
			{
				path: '/he-thong-quan-li-van-bang-to-nghiep/so-van-bang',
				name: 'Sổ văn bằng',
				component: './HeThongQuanLiVaBangTotNghiep/SoVanBang',
			},
			{
				path: '/he-thong-quan-li-van-bang-to-nghiep/quyet-dinh-tot-nghiep',
				name: 'Quyết định tốt nghiệp',
				component: './HeThongQuanLiVaBangTotNghiep/QuyetDinhTotNghiep',
			},
			{
				path: '/he-thong-quan-li-van-bang-to-nghiep/van-bang-tot-nghiep',
				name: 'Văn bằng tốt nghiệp',
				component: './HeThongQuanLiVaBangTotNghiep/VanBangTotNghiep',
			},
			{
				path: '/he-thong-quan-li-van-bang-to-nghiep/tra-cuu-van-bang',
				name: 'Tra cứu văn bằng',
				component: './HeThongQuanLiVaBangTotNghiep/TraCuuVanBang',
			},
		],
	},
	{
		path: '/he-thong-lap-ke-hoach-du-lich',
		name: 'Hệ thống lập kế hoạch du lịch',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-lap-ke-hoach-du-lich/trang-chu',
				name: 'Trang chủ',
				component: './HeThongLapKeHoachDuLich',
			},
			{
				path: '/he-thong-lap-ke-hoach-du-lich/trang-admin',
				name: 'Trang admin',
				component: './HeThongLapKeHoachDuLich/TrangAdmin',
				exact: true,
			},
		],
	},
	{
		path: '/quan-ly-khoa-hoc-online',
		name: 'Quản lý khóa học online',
		icon: 'OrderedListOutlined',
		component: './QuanLyKhoaHocOnline',
	},
	{
		path: '/he-thong-ung-dung-blog-ca-nhan',
		name: 'Hệ thống ứng dụng blog cá nhân',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-ung-dung-blog-ca-nhan/trang-chu',
				name: 'Trang chủ',
				component: './HeThongUngDungBlogCaNhan',
			},
			{
				path: '/he-thong-ung-dung-blog-ca-nhan/trang-gioi-thieu',
				name: 'Trang giới thiệu',
				component: './HeThongUngDungBlogCaNhan/TrangGioiThieu',
				exact: true,
			},
			{
				path: '/he-thong-ung-dung-blog-ca-nhan/trang-chi-tiet-bai-viet/:id',
				name: 'Trang chi tiết bài viết',
				component: './HeThongUngDungBlogCaNhan/TrangChiTietBaiViet',
				exact: true,
			},
			{
				path: '/he-thong-ung-dung-blog-ca-nhan/quan-ly-bai-viet',
				name: 'Quản lý bài viết',
				component: './HeThongUngDungBlogCaNhan/QuanLyBaiViet',
				exact: true,
			},
			{
				path: '/he-thong-ung-dung-blog-ca-nhan/quan-ly-the',
				name: 'Quản lý thẻ',
				component: './HeThongUngDungBlogCaNhan/QuanLyThe',
				exact: true,
			},
		],
	},
	{
		path: '/he-thong-xay-dung-ung-dung-the-duc-theo-doi-suc-khoe',
		name: 'Hệ thống ứng dụng thể dục theo dõi sức khỏe',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-xay-dung-ung-dung-the-duc-theo-doi-suc-khoe/trang-chu',
				name: 'Trang chủ',
				component: './HeThongXayDungUngDungTheDucTheoDoiSucKhoe',
			},
			{
				path: '/he-thong-xay-dung-ung-dung-the-duc-theo-doi-suc-khoe/nhat-ky-tap-luyen',
				name: 'Nhật ký tập luyện',
				component: './HeThongXayDungUngDungTheDucTheoDoiSucKhoe/NhatKyTapLuyen',
				exact: true,
			},
			{
				path: '/he-thong-xay-dung-ung-dung-the-duc-theo-doi-suc-khoe/nhat-ky-chi-so-suc-khoe',
				name: 'Nhật ký chỉ số sức khỏe',
				component: './HeThongXayDungUngDungTheDucTheoDoiSucKhoe/NhatKyChiSoSucKhoe',
				exact: true,
			},
			{
				path: '/he-thong-xay-dung-ung-dung-the-duc-theo-doi-suc-khoe/quan-ly-muc-tieu',
				name: 'Quản lý mục tiêu',
				component: './HeThongXayDungUngDungTheDucTheoDoiSucKhoe/QuanLyMucTieu',
				exact: true,
			},
			{
				path: '/he-thong-xay-dung-ung-dung-the-duc-theo-doi-suc-khoe/thu-vien-bai-tap',
				name: 'Thư viện bài tập',
				component: './HeThongXayDungUngDungTheDucTheoDoiSucKhoe/ThuVienBaiTap',
				exact: true,
			},
		],
	},
	{
		path: '/he-thong-theo-doi-cong-viec-ca-nhan',
		name: 'Hệ thống theo dõi công việc cá nhân',
		icon: 'OrderedListOutlined',
		routes: [
			{
				path: '/he-thong-theo-doi-cong-viec-ca-nhan/dashboard',
				name: 'dashboard',
				component: './HeThongTheoDoiCongViecCaNhan',
			},
			{
				path: '/he-thong-theo-doi-cong-viec-ca-nhan/kanban-board',
				name: 'Kanban Board',
				component: './HeThongTheoDoiCongViecCaNhan/KanbanBoard',
				exact: true,
			},
			{
				path: '/he-thong-theo-doi-cong-viec-ca-nhan/danh-sach-tasks',
				name: 'Danh sách tasks',
				component: './HeThongTheoDoiCongViecCaNhan/DanhSachTasks',
				exact: true,
			},
			{
				path: '/he-thong-theo-doi-cong-viec-ca-nhan/quan-ly-tag',
				name: 'Quản lý tag',
				component: './HeThongTheoDoiCongViecCaNhan/QuanLyTag',
				exact: true,
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: '/notification/subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: '/notification/check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: '/notification',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
