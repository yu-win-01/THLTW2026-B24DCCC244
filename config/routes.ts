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
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
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
