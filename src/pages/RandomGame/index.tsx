import { useState } from 'react';
import { Card, InputNumber, Button, Space, Alert, Statistic, Row, Col } from 'antd';
import {
	ReloadOutlined,
	ThunderboltOutlined,
	TrophyOutlined,
	FireOutlined,
	CloseCircleOutlined,
	CheckCircleOutlined,
} from '@ant-design/icons';

const RandomGame: React.FC = () => {
	const SinhSoNgauNhien = () => {
		return Math.floor(Math.random() * 100) + 1;
	};

	const [soNgauNhien, setSoNgauNhien] = useState<number>(SinhSoNgauNhien());
	const [doan, setDoan] = useState<number | null>(null);
	const [message, setMessage] = useState<string>('');
	const [messageType, setMessageType] = useState<'success' | 'info' | 'warning' | 'error'>('info');
	const [soLanDoan, setSoLanDoan] = useState<number>(10);
	const [soLanDaDoan, setSoLanDaDoan] = useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [status, setStatus] = useState<string>('Đang chơi');

	const handleDoan = () => {
		if (gameOver) return;

		const userDoan = doan;

		if (!userDoan || userDoan < 1 || userDoan > 100) {
			setMessage('Vui lòng nhập một số tự nhiên từ 1 đến 100.');
			setMessageType('warning');
			return;
		}

		if (soLanDoan <= 1) {
			setMessage(`Bạn đã hết lượt đoán! Số đúng là ${soNgauNhien}.`);
			setMessageType('error');
			setGameOver(true);
			setStatus('Thua cuộc');
			return;
		}

		setSoLanDaDoan(soLanDaDoan + 1);

		if (userDoan < soNgauNhien) {
			setMessage('Số bạn đoán quá thấp! Hãy thử số lớn hơn.');
			setMessageType('info');
		} else if (userDoan > soNgauNhien) {
			setMessage('Số bạn đoán quá cao! Hãy thử số nhỏ hơn.');
			setMessageType('info');
		} else {
			setMessage(`Chúc mừng! Bạn đã đoán đúng số ${soNgauNhien}!`);
			setMessageType('success');
			setGameOver(true);
			setStatus('Chiến thắng');
			return;
		}

		setSoLanDoan(soLanDoan - 1);
	};

	const handleReset = () => {
		setSoNgauNhien(SinhSoNgauNhien());
		setDoan(null);
		setMessage('');
		setSoLanDoan(10);
		setSoLanDaDoan(0);
		setGameOver(false);
		setStatus('Đang chơi');
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleDoan();
		}
	};

	return (
		<div style={{ padding: '24px', background: '#f0f2f5' }}>
			<h2 style={{ marginBottom: 24 }}>Trò chơi đoán số</h2>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} sm={12} lg={8}>
					<Card hoverable>
						<Statistic
							title='Số lần còn lại'
							value={soLanDoan}
							valueStyle={{ color: soLanDoan <= 3 ? '#cf1322' : '#3f8600' }}
						/>
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={8}>
					<Card hoverable>
						<Statistic title='Số lần đã đoán' value={soLanDaDoan} valueStyle={{ color: '#1890ff' }} />
					</Card>
				</Col>

				<Col xs={24} sm={12} lg={8}>
					<Card hoverable>
						<Statistic
							title='Trạng thái'
							value={status}
							prefix={gameOver && status === 'Chiến thắng' ? <CheckCircleOutlined /> : <FireOutlined />}
							valueStyle={{
								color: status === 'Chiến thắng' ? '#52c41a' : status === 'Thua cuộc' ? '#cf1322' : '#faad14',
								fontSize: 18,
							}}
						/>
					</Card>
				</Col>
			</Row>

			<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
				<Col xs={24} lg={12}>
					<Card title='Khu vực chơi' hoverable>
						<div>
							<label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Nhập số bạn đoán:</label>
							<Space direction='horizontal' style={{ width: '100%', display: 'flex' }}>
								<InputNumber
									size='large'
									min={1}
									max={100}
									value={doan}
									onChange={(value) => setDoan(value)}
									onKeyPress={handleKeyPress}
									disabled={gameOver}
									placeholder='Nhập số từ 1-100'
									style={{ flex: 1, minWidth: 150 }}
								/>
								<Button type='primary' size='large' onClick={handleDoan} disabled={gameOver || !doan}>
									Đoán
								</Button>
								<Button size='large' onClick={handleReset} icon={<ReloadOutlined />}>
									Chơi lại
								</Button>
							</Space>
						</div>
					</Card>
				</Col>

				<Col xs={24} lg={12}>
					<Card title='Kết quả' hoverable style={{ height: '100%' }}>
						{message ? (
							<Alert message={message} type={messageType} showIcon style={{ marginBottom: 16 }} />
						) : (
							<Alert message='Bắt đầu đoán số từ 1 đến 100!' type='info' showIcon style={{ marginBottom: 16 }} />
						)}

						{gameOver && (
							<div style={{ textAlign: 'center', padding: '20px 0' }}>
								{status === 'Chiến thắng' ? (
									<TrophyOutlined style={{ fontSize: 64, color: '#52c41a' }} />
								) : (
									<CloseCircleOutlined style={{ fontSize: 64, color: '#cf1322' }} />
								)}
								<div style={{ marginTop: 16, fontSize: 18, fontWeight: 'bold' }}>
									{status === 'Chiến thắng' ? `Bạn đã thắng sau ${soLanDaDoan} lần đoán!` : 'Hãy thử lại lần nữa!'}
								</div>
							</div>
						)}
					</Card>
				</Col>
			</Row>
		</div>
	);
};
export default RandomGame;
