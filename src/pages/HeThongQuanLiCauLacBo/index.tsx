import React from 'react';
import { Tabs, Card } from 'antd';
import DanhSachCauLacBo from './DanhSachCauLacBo';
import QuanLyDonDangKyThanhVien from './QuanLyDonDangKyThanhVien';
import QuanLyThanhVienCuaCLB from './QuanLyThanhVienCuaCLB';
import BaoCaoThongKeHoatDongCLB from './BaoCaoThongKeHoatDongCLB';

const HeThongQuanLiCauLacBo: React.FC = () => {
	return (
		<Card>
			<Tabs type='card'>
				<Tabs.TabPane key='1' tab='Danh sách câu lạc bộ'>
					<DanhSachCauLacBo />
				</Tabs.TabPane>
				<Tabs.TabPane key='2' tab='Quản lý đơn đăng ký thành viên'>
					<QuanLyDonDangKyThanhVien />
				</Tabs.TabPane>
				<Tabs.TabPane key='3' tab='Quản lý thành viên của câu lạc bộ'>
					<QuanLyThanhVienCuaCLB />
				</Tabs.TabPane>
				<Tabs.TabPane key='4' tab='Báo cáo thống kê hoạt động CLB'>
					<BaoCaoThongKeHoatDongCLB />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default HeThongQuanLiCauLacBo;
