import React from 'react';
import { Tabs, Card } from 'antd';
import SoVanBang from './SoVanBang';
import QuyetDinhTotNghiep from './QuyetDinhTotNghiep';
import CauHinhBieuMau from './CauHinhBieuMau';
import VanBangTotNghiep from './VanBangTotNghiep';
import TraCuuVanBang from './TraCuuVanBang';

const HeThongQuanLiVaBangTotNghiep: React.FC = () => {
	return (
		<Card>
			<Tabs type='card'>
				<Tabs.TabPane key='1' tab='Quản Lý Sổ Văn Bằng'>
					<SoVanBang />
				</Tabs.TabPane>
				<Tabs.TabPane key='2' tab='Quyết Định Tốt Nghiệp'>
					<QuyetDinhTotNghiep />
				</Tabs.TabPane>
				<Tabs.TabPane key='3' tab='Cấu Hình Biểu Mẫu'>
					<CauHinhBieuMau />
				</Tabs.TabPane>
				<Tabs.TabPane key='4' tab='Quản Lý Văn Bằng'>
					<VanBangTotNghiep />
				</Tabs.TabPane>
				<Tabs.TabPane key='5' tab='Tra Cứu Văn Bằng'>
					<TraCuuVanBang />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default HeThongQuanLiVaBangTotNghiep;
