import { useState, useMemo } from 'react';
import { Card, Button, Table, Space, Row, Col, Statistic, Tag, Divider } from 'antd';
import { TrophyOutlined, RobotOutlined, UserOutlined, HistoryOutlined, PlayCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

type luaChon = 'keo' | 'bua' | 'bao';

interface lichSuTroChoi {
	nguoiChoi: luaChon;
	mayTinh: luaChon;
	ketQua: string;
}

const danhSachLuaChon: luaChon[] = ['keo', 'bua', 'bao'];

const getIcon = (choice: luaChon | null) => {
	switch (choice) {
		case 'keo':
			return 'Kéo';
		case 'bua':
			return 'Búa';
		case 'bao':
			return 'Bao';
		default:
			return 'unknown';
	}
};

export default function TroChoiOanTuTi() {
	const [luaChonNguoiChoi, setLuaChonNguoiChoi] = useState<luaChon | null>(null);
	const [luaChonMayTinh, setLuaChonMayTinh] = useState<luaChon | null>(null);
	const [ketQua, setKetQua] = useState<string>('');
	const [lichSu, setLichSu] = useState<lichSuTroChoi[]>([]);

	const getluaChonMayTinh = (): luaChon => {
		const index = Math.floor(Math.random() * danhSachLuaChon.length);
		return danhSachLuaChon[index];
	};

	const kiemTraKetQua = (nguoiChoi: luaChon, mayTinh: luaChon): string => {
		if (nguoiChoi === mayTinh) {
			return 'Hòa';
		} else if (
			(nguoiChoi === 'keo' && mayTinh === 'bao') ||
			(nguoiChoi === 'bua' && mayTinh === 'keo') ||
			(nguoiChoi === 'bao' && mayTinh === 'bua')
		) {
			return 'Bạn thắng!';
		} else {
			return 'Máy tính thắng!';
		}
	};

	const handlePlay = () => {
		if (!luaChonNguoiChoi) {
			setKetQua('Vui lòng chọn kéo, búa hoặc bao!');
			return;
		} else {
			const mayTinh = getluaChonMayTinh();
			setLuaChonMayTinh(mayTinh);
			const ketQuaTroChoi = kiemTraKetQua(luaChonNguoiChoi, mayTinh);
			setKetQua(ketQuaTroChoi);

			setLichSu((prevLichSu) => [
				{
					nguoiChoi: luaChonNguoiChoi!,
					mayTinh,
					ketQua: ketQuaTroChoi,
				},
				...prevLichSu,
			]);
		}
	};

	const thongKe = useMemo(() => {
		const thang = lichSu.filter((item) => item.ketQua === 'Bạn thắng!').length;
		const thua = lichSu.filter((item) => item.ketQua === 'Máy tính thắng!').length;
		const hoa = lichSu.filter((item) => item.ketQua === 'Hòa').length;
		const tiLe = lichSu.length > 0 ? ((thang / lichSu.length) * 100).toFixed(1) : 0;
		return { thang, thua, hoa, tiLe };
	}, [lichSu]);

	const columns: ColumnsType<lichSuTroChoi> = [
		{
			title: 'STT',
			key: 'index',
			width: 70,
			align: 'center',
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: 'Người chơi',
			dataIndex: 'nguoiChoi',
			key: 'nguoiChoi',
			align: 'center',
			render: (choice: luaChon) => (
				<Space>
					<span style={{ fontSize: '24px' }}>{getIcon(choice)}</span>
				</Space>
			),
		},
		{
			title: 'Máy tính',
			dataIndex: 'mayTinh',
			key: 'mayTinh',
			align: 'center',
			render: (choice: luaChon) => (
				<Space>
					<span style={{ fontSize: '24px' }}>{getIcon(choice)}</span>
				</Space>
			),
		},
		{
			title: 'Kết quả',
			dataIndex: 'ketQua',
			key: 'ketQua',
			align: 'center',
			render: (result: string) => {
				let color = 'default';
				if (result === 'Bạn thắng!') color = 'success';
				else if (result === 'Máy tính thắng!') color = 'error';
				else if (result === 'Hòa') color = 'warning';
				return <Tag color={color}>{result}</Tag>;
			},
		},
	];

	return (
		<div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
			<Card title={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>Trò chơi Oẳn Tù Tì</span>} bordered={false}>
				<Card type='inner' title='Chọn lựa chọn của bạn' style={{ marginBottom: '24px' }}>
					<Space direction='vertical' size='large' style={{ width: '100%' }}>
						<Space size='large' style={{ justifyContent: 'center', width: '100%', display: 'flex' }}>
							{danhSachLuaChon.map((choice) => (
								<Button
									key={choice}
									type={luaChonNguoiChoi === choice ? 'primary' : 'default'}
									size='large'
									onClick={() => setLuaChonNguoiChoi(choice)}
									style={{
										height: '100px',
										width: '100px',
										fontSize: '40px',
										display: 'flex',
										flexDirection: 'column',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<div>{getIcon(choice)}</div>
								</Button>
							))}
						</Space>
						<Row justify='center'>
							<Button
								type='primary'
								size='large'
								onClick={handlePlay}
								disabled={!luaChonNguoiChoi}
								style={{ height: '50px', fontSize: '18px', fontWeight: 'bold', width: '400px' }}
							>
								<PlayCircleOutlined />
								Chơi ngay!
							</Button>
						</Row>
					</Space>
				</Card>

				<Row gutter={[24, 24]}>
					{/* Kết quả */}
					{ketQua && (
						<Col xs={24} lg={12}>
							<Card
								type='inner'
								title='Kết quả'
								headStyle={{
									backgroundColor:
										ketQua === 'Bạn thắng!' ? '#f6ffed' : ketQua === 'Máy tính thắng!' ? '#fff2e8' : '#fffbe6',
								}}
							>
								<Row gutter={16}>
									<Col span={10} style={{ textAlign: 'center' }}>
										<div style={{ fontSize: '60px', marginBottom: '8px' }}>{getIcon(luaChonNguoiChoi)}</div>
										<div style={{ fontSize: '16px', color: '#666' }}>
											<UserOutlined /> Bạn
										</div>
									</Col>
									<Col span={4} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
										<div style={{ fontSize: '30px', fontWeight: 'bold' }}>VS</div>
									</Col>
									<Col span={10} style={{ textAlign: 'center' }}>
										<div style={{ fontSize: '60px', marginBottom: '8px' }}>{getIcon(luaChonMayTinh)}</div>
										<div style={{ fontSize: '16px', color: '#666' }}>
											<RobotOutlined /> Máy tính
										</div>
									</Col>
								</Row>
								<Divider />
								<div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
									{ketQua === 'Bạn thắng!' && <span style={{ color: '#52c41a' }}>{ketQua}</span>}
									{ketQua === 'Máy tính thắng!' && <span style={{ color: '#ff4d4f' }}>{ketQua}</span>}
									{ketQua === 'Hòa' && <span style={{ color: '#faad14' }}>{ketQua}</span>}
								</div>
							</Card>
						</Col>
					)}

					<Col xs={24} lg={ketQua ? 12 : 24}>
						<Card type='inner' title='Thống kê'>
							<Row gutter={16}>
								<Col xs={12} md={ketQua ? 12 : 6}>
									<Statistic title='Tổng số trận' value={lichSu.length} valueStyle={{ color: '#1890ff' }} />
								</Col>
								<Col xs={12} md={ketQua ? 12 : 6}>
									<Statistic title='Tỷ lệ thắng' value={thongKe.tiLe} suffix='%' valueStyle={{ color: '#52c41a' }} />
								</Col>
								<Col xs={8} md={ketQua ? 8 : 4}>
									<Statistic
										title='Thắng'
										value={thongKe.thang}
										valueStyle={{ color: '#52c41a' }}
										prefix={<TrophyOutlined />}
									/>
								</Col>
								<Col xs={8} md={ketQua ? 8 : 4}>
									<Statistic title='Thua' value={thongKe.thua} valueStyle={{ color: '#ff4d4f' }} />
								</Col>
								<Col xs={8} md={ketQua ? 8 : 4}>
									<Statistic title='Hòa' value={thongKe.hoa} valueStyle={{ color: '#faad14' }} />
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>

				<Card
					type='inner'
					title={
						<Space>
							<HistoryOutlined />
							<span>Lịch sử trò chơi</span>
						</Space>
					}
					style={{ marginTop: '24px' }}
					extra={
						lichSu.length > 0 && (
							<Button
								danger
								onClick={() => {
									setLichSu([]);
									setKetQua('');
									setLuaChonNguoiChoi(null);
									setLuaChonMayTinh(null);
								}}
							>
								Xóa lịch sử
							</Button>
						)
					}
				>
					<Table
						columns={columns}
						dataSource={lichSu}
						rowKey={(_, index) => index?.toString() || ''}
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showTotal: (total) => `Tổng ${total} trận`,
						}}
						locale={{ emptyText: 'Chưa có lịch sử chơi' }}
					/>
				</Card>
			</Card>
		</div>
	);
}
