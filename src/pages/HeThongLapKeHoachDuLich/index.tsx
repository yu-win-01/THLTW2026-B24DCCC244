import React from 'react';
import { Tabs } from 'antd';
import { HomeOutlined, CalendarOutlined, DollarOutlined } from '@ant-design/icons';
import TrangChu from './TrangChu';
import TaoLichTrinh from './TaoLichTrinh';
import QuanLyNganSach from './QuanLyNganSach';

const { TabPane } = Tabs;

const HeThongLapKeHoachDuLich: React.FC = () => {
	return (
		<Tabs defaultActiveKey='1'>
			<TabPane
				tab={
					<span>
						<HomeOutlined />
						Trang chủ
					</span>
				}
				key='1'
			>
				<TrangChu />
			</TabPane>
			<TabPane
				tab={
					<span>
						<CalendarOutlined />
						Tạo lịch trình
					</span>
				}
				key='2'
			>
				<TaoLichTrinh />
			</TabPane>
			<TabPane
				tab={
					<span>
						<DollarOutlined />
						Quản lý ngân sách
					</span>
				}
				key='3'
			>
				<QuanLyNganSach />
			</TabPane>
		</Tabs>
	);
};

export default HeThongLapKeHoachDuLich;