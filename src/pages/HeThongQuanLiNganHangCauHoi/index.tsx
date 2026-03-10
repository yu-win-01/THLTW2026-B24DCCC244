import { Tabs, Card, Statistic, Row, Col } from 'antd';
import {
	BookOutlined,
	FileTextOutlined,
	QuestionCircleOutlined,
	ScheduleOutlined,
	FileAddOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import QuanLyKhoiKienThuc from './QuanLyKhoiKienThuc';
import QuanLyMonHoc from './QuanLyMonHoc';
import QuanLyCauHoi from './QuanLyCauHoi';
import TaoDeThiTheoCauTruc from './TaoDeThiTheoCauTruc';
import QuanLyDeThi from './QuanLyDeThi';

const { TabPane } = Tabs;

const HeThongQuanLiNganHangCauHoi = () => {
	const { khoiKienThuc, monHoc, cauHoi, cauTrucDeThi, deThi } = useModel('quanlydethi');

	return (
		<div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
			<h1 style={{ marginBottom: 24 }}>Hệ Thống Quản Lý Ngân Hàng Câu Hỏi</h1>

			{/* Dashboard thống kê */}
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Khối kiến thức'
							value={khoiKienThuc.length}
							prefix={<BookOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Môn học'
							value={monHoc.length}
							prefix={<FileTextOutlined />}
							valueStyle={{ color: '#1890ff' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Câu hỏi'
							value={cauHoi.length}
							prefix={<QuestionCircleOutlined />}
							valueStyle={{ color: '#cf1322' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Đề thi'
							value={deThi.length}
							prefix={<ScheduleOutlined />}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>
			</Row>

			{/* Tabs quản lý */}
			<Card>
				<Tabs defaultActiveKey='khoiKienThuc' type='card'>
					<TabPane
						tab={
							<span>
								<BookOutlined />
								Khối kiến thức
							</span>
						}
						key='khoiKienThuc'
					>
						<QuanLyKhoiKienThuc />
					</TabPane>

					<TabPane
						tab={
							<span>
								<FileTextOutlined />
								Môn học
							</span>
						}
						key='monHoc'
					>
						<QuanLyMonHoc />
					</TabPane>

					<TabPane
						tab={
							<span>
								<QuestionCircleOutlined />
								Câu hỏi
							</span>
						}
						key='cauHoi'
					>
						<QuanLyCauHoi />
					</TabPane>

					<TabPane
						tab={
							<span>
								<FileAddOutlined />
								Tạo cấu trúc đề thi
							</span>
						}
						key='cauTrucDeThi'
					>
						<TaoDeThiTheoCauTruc />
					</TabPane>

					<TabPane
						tab={
							<span>
								<ScheduleOutlined />
								Đề thi
							</span>
						}
						key='deThi'
					>
						<QuanLyDeThi />
					</TabPane>
				</Tabs>
			</Card>
		</div>
	);
};

export default HeThongQuanLiNganHangCauHoi;
