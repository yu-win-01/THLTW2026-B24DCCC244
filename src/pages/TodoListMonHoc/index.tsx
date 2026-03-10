import { useState, useEffect } from 'react';
import { Tabs, Button, Modal, Card, Row, Col, Statistic, Empty } from 'antd';
import { BookOutlined, PlusOutlined, OrderedListOutlined } from '@ant-design/icons';
import { useMonHocModel } from '@/models/monhoc';
import { useTienTrinhMonHocModel } from '@/models/tientrinhhoctap';
import { useMucTieuMonHocModel } from '@/models/muctieumonhoc';
import TienDoHocTap from './tienDoHocTap';
import DanhSachMonHoc from './danhSachMonHoc';
import '@/utils/debugLocalStorage'; // Import debug utilities

const { TabPane } = Tabs;

const TodoListMonHoc = () => {
	const { monHoc, refreshMonHoc } = useMonHocModel();
	const { tienTrinhMonHoc, refreshTienTrinhMonHoc } = useTienTrinhMonHocModel();
	const { mucTieuMonHoc, refreshMucTieuMonHoc } = useMucTieuMonHocModel();
	const [activeKey, setActiveKey] = useState<string>('');
	const [isDanhSachModalOpen, setIsDanhSachModalOpen] = useState<boolean>(false);

	const tongSoMonHoc = monHoc.length;
	const tongThoiGianHoc = tienTrinhMonHoc.reduce((sum, item) => sum + item.thoiLuongHoc, 0);
	const tongMucTieu = mucTieuMonHoc.reduce((sum, item) => sum + item.muctieu, 0);
	const tiLeHoanThanh = tongMucTieu > 0 ? Math.min((tongThoiGianHoc / tongMucTieu) * 100, 100) : 0;

	useEffect(() => {
		if (monHoc.length > 0) {
			const activeMonHocExists = monHoc.some((mon) => mon.id.toString() === activeKey);
			if (!activeKey || !activeMonHocExists) {
				setActiveKey(monHoc[0].id.toString());
			}
		} else {
			setActiveKey('');
		}
	}, [monHoc]);

	useEffect(() => {
		const handleTienTrinhUpdate = () => {
			console.log('🔔 Event: tientrinhmonhoc-updated - Refreshing data...');
			refreshTienTrinhMonHoc();
		};
		const handleMucTieuUpdate = () => {
			console.log('🔔 Event: muctieumonhoc-updated - Refreshing data...');
			refreshMucTieuMonHoc();
		};

		window.addEventListener('tientrinhmonhoc-updated', handleTienTrinhUpdate);
		window.addEventListener('muctieumonhoc-updated', handleMucTieuUpdate);

		return () => {
			window.removeEventListener('tientrinhmonhoc-updated', handleTienTrinhUpdate);
			window.removeEventListener('muctieumonhoc-updated', handleMucTieuUpdate);
		};
	}, [refreshTienTrinhMonHoc, refreshMucTieuMonHoc]);

	const handleTabChange = (key: string) => {
		setActiveKey(key);
	};

	const handleCloseModal = () => {
		setIsDanhSachModalOpen(false);
		refreshMonHoc();
		refreshTienTrinhMonHoc();
		refreshMucTieuMonHoc();
	};

	return (
		<div style={{ padding: '24px', background: '#f0f2f5' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
				<h2>Quản lý học tập</h2>
				<Button type='primary' icon={<OrderedListOutlined />} onClick={() => setIsDanhSachModalOpen(true)}>
					Danh sách môn học
				</Button>
			</div>
			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tổng số môn học'
							value={tongSoMonHoc}
							prefix={<BookOutlined />}
							valueStyle={{ color: '#3f8600' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic title='Tổng thời gian học (giờ)' value={tongThoiGianHoc} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tổng mục tiêu (giờ)'
							value={tongMucTieu || 'Chưa đặt'}
							valueStyle={{ color: '#722ed1' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={6}>
					<Card hoverable>
						<Statistic
							title='Tỷ lệ hoàn thành'
							value={tiLeHoanThanh.toFixed(1)}
							suffix='%'
							valueStyle={{ color: tiLeHoanThanh >= 100 ? '#52c41a' : '#faad14' }}
						/>
					</Card>
				</Col>
			</Row>
			<Card>
				{monHoc.length === 0 ? (
					<Empty
						description={
							<span>
								Chưa có môn học nào. <br />
								Vui lòng thêm môn học mới!
							</span>
						}
					>
						<Button type='primary' icon={<PlusOutlined />} onClick={() => setIsDanhSachModalOpen(true)}>
							Thêm môn học đầu tiên
						</Button>
					</Empty>
				) : (
					<Tabs activeKey={activeKey} onChange={handleTabChange} type='card'>
						{monHoc.map((mon) => (
							<TabPane
								tab={
									<span>
										<OrderedListOutlined />
										{mon.tenMonHoc}
									</span>
								}
								key={mon.id.toString()}
							>
								<TienDoHocTap subjectId={mon.id} subjectName={mon.tenMonHoc} />
							</TabPane>
						))}
					</Tabs>
				)}
			</Card>

			<Modal
				title='Quản lý danh sách môn học'
				visible={isDanhSachModalOpen}
				onCancel={handleCloseModal}
				onOk={handleCloseModal}
				okText='Đóng'
				cancelButtonProps={{ style: { display: 'none' } }}
				width={800}
			>
				<DanhSachMonHoc />
			</Modal>
		</div>
	);
};

export default TodoListMonHoc;
