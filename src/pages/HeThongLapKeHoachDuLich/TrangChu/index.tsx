import React, { useState, useMemo } from 'react';
import {
	Card,
	Row,
	Col,
	Select,
	Input,
	Rate,
	Button,
	Space,
	Typography,
	Tag,
	Slider,
} from 'antd';
import { EnvironmentOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons';
import useTravelSystem from '@/models/listdulich';

const { Title, Text } = Typography;

const TrangChu: React.FC = () => {
	const { diemDen } = useTravelSystem();
	const [searchText, setSearchText] = useState('');
	const [loaiHinh, setLoaiHinh] = useState<string | undefined>();
	const [giaMin, setGiaMin] = useState<number>(0);
	const [giaMax, setGiaMax] = useState<number>(10000000);
	const [ratingMin, setRatingMin] = useState<number>(0);
	const [sortBy, setSortBy] = useState<string>('rating');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	const filteredDiemDen = useMemo(() => {
		const result = diemDen.filter((dd) => {
			if (searchText && !dd.ten.toLowerCase().includes(searchText.toLowerCase()) &&
				!dd.diaChi.toLowerCase().includes(searchText.toLowerCase())) {
				return false;
			}
			if (loaiHinh && dd.loaiHinh !== loaiHinh) return false;
			if (dd.gia < giaMin || dd.gia > giaMax) return false;
			if (dd.rating < ratingMin) return false;
			return true;
		});

		result.sort((a, b) => {
			let comparison = 0;
			switch (sortBy) {
				case 'gia':
					comparison = a.gia - b.gia;
					break;
				case 'rating':
					comparison = a.rating - b.rating;
					break;
				case 'ten':
					comparison = a.ten.localeCompare(b.ten);
					break;
				default:
					comparison = 0;
			}
			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return result;
	}, [diemDen, searchText, loaiHinh, giaMin, giaMax, ratingMin, sortBy, sortOrder]);

	const getLoaiHinhTag = (type: string) => {
		const config: Record<string, { color: string; text: string }> = {
			bien: { color: 'blue', text: 'Biển' },
			nui: { color: 'green', text: 'Núi' },
			thanh_pho: { color: 'purple', text: 'Thành phố' },
		};
		return config[type] || { color: 'default', text: type };
	};

	const handleResetFilters = () => {
		setSearchText('');
		setLoaiHinh(undefined);
		setGiaMin(0);
		setGiaMax(10000000);
		setRatingMin(0);
	};

	return (
		<div style={{ padding: '20px' }}>
			<Title level={2} style={{ marginBottom: '24px' }}>
				<EnvironmentOutlined style={{ marginRight: 8 }} />
				Khám phá điểm đến
			</Title>

			<Card style={{ marginBottom: '24px' }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6}>
						<Input
							placeholder='Tìm kiếm địa điểm...'
							prefix={<SearchOutlined />}
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							allowClear
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder='Loại hình'
							value={loaiHinh}
							onChange={setLoaiHinh}
							allowClear
							style={{ width: '100%' }}
							options={[
								{ value: 'bien', label: 'Biển' },
								{ value: 'nui', label: 'Núi' },
								{ value: 'thanh_pho', label: 'Thành phố' },
							]}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Select
							placeholder='Sắp xếp theo'
							value={sortBy}
							onChange={setSortBy}
							style={{ width: '100%' }}
							options={[
								{ value: 'gia', label: 'Giá' },
								{ value: 'rating', label: 'Đánh giá' },
								{ value: 'ten', label: 'Tên' },
							]}
						/>
					</Col>
					<Col xs={24} sm={12} md={6}>
						<Space>
							<Select
								value={sortOrder}
								onChange={setSortOrder}
								style={{ width: '80px' }}
								options={[
									{ value: 'desc', label: 'Giảm' },
									{ value: 'asc', label: 'Tăng' },
								]}
							/>
							<Button icon={<FilterOutlined />} onClick={handleResetFilters}>
								Xóa lọc
							</Button>
						</Space>
					</Col>
					<Col xs={24} sm={12} md={12}>
						<Text>Khoảng giá: </Text>
						<Slider
							range
							min={0}
							max={10000000}
							step={100000}
							value={[giaMin, giaMax]}
							onChange={(value: [number, number]) => {
								setGiaMin(value[0]);
								setGiaMax(value[1]);
							}}
						/>
					</Col>
					<Col xs={24} sm={12} md={12}>
						<Text>Rating tối thiểu: </Text>
						<Rate
							allowHalf
							value={ratingMin}
							onChange={setRatingMin}
						/>
					</Col>
				</Row>
			</Card>

			<Text type='secondary'>
				Tìm thấy {filteredDiemDen.length} điểm đến
			</Text>

			<Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
				{filteredDiemDen.map((dd) => (
					<Col xs={24} sm={12} md={8} lg={6} key={dd.id}>
						<Card
							hoverable
							cover={
								<img
									alt={dd.ten}
									src={dd.hinhAnh}
									style={{ height: '180px', objectFit: 'cover' }}
								/>
							}
							actions={[
								<Text strong>
									{new Intl.NumberFormat('vi-VN').format(dd.gia)} ₫
								</Text>,
								<Space>
									<Text type='secondary'>Thời gian:</Text>
									<Text>{dd.thoiGianThamQuan}p</Text>
								</Space>,
							]}
						>
							<Card.Meta
								title={
									<Space>
										<Text strong>{dd.ten}</Text>
										<Tag color={getLoaiHinhTag(dd.loaiHinh).color}>
											{getLoaiHinhTag(dd.loaiHinh).text}
										</Tag>
									</Space>
								}
								description={
									<>
										<div>
											<EnvironmentOutlined /> {dd.diaChi}
										</div>
										<div style={{ marginTop: 4 }}>
											<Text type='secondary' ellipsis>
												{dd.moTa}
											</Text>
										</div>
										<div style={{ marginTop: 8 }}>
											<Space>
												<Rate disabled value={dd.rating} allowHalf />
												<Text type='secondary'>({dd.rating})</Text>
											</Space>
										</div>
									</>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default TrangChu;