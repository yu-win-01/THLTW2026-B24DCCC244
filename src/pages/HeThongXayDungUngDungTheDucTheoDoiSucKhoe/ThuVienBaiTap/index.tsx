import React, { useState, useMemo } from 'react';
import { Card, Button, Modal, Form, Select, Input, InputNumber, Popconfirm, Space, Tag, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { Exercise } from '@/models/ungdungtheodoisuckhoe';

const { Option } = Select;
const { Meta } = Card;

interface DuLieuBieuMauBaiTap {
	tenBaiTap: string;
	nhomCo: Exercise['nhomCo'];
	mucDo: Exercise['mucDo'];
	moTa: string;
	huongDan: string;
	caloTrungBinhMotGio: number;
}

const ThuVienBaiTap: React.FC = () => {
	const { danhSachBaiTap, themBaiTap, capNhatBaiTap, xoaBaiTap } = useModel('ungdungtheodoisuckhoe');
	const [moModal, setMoModal] = useState(false);
	const [moModalChiTiet, setMoModalChiTiet] = useState(false);
	const [baiTapDangSua, setBaiTapDangSua] = useState<Exercise | null>(null);
	const [baiTapDaChon, setBaiTapDaChon] = useState<Exercise | null>(null);
	const [bieuMau] = Form.useForm();

	const [vanBanTimKiem, setVanBanTimKiem] = useState('');
	const [locNhomCo, setLocNhomCo] = useState<Exercise['nhomCo'] | 'all'>('all');
	const [locDoKho, setLocDoKho] = useState<Exercise['mucDo'] | 'all'>('all');

	const danhSachBaiTapDaLoc = useMemo(() => {
		return danhSachBaiTap.filter((baiTap) => {
			const khopTimKiem = baiTap.tenBaiTap.toLowerCase().includes(vanBanTimKiem.toLowerCase());
			const khopNhomCo = locNhomCo === 'all' || baiTap.nhomCo === locNhomCo;
			const khopDoKho = locDoKho === 'all' || baiTap.mucDo === locDoKho;

			return khopTimKiem && khopNhomCo && khopDoKho;
		});
	}, [danhSachBaiTap, vanBanTimKiem, locNhomCo, locDoKho]);

	const moModalSua = (baiTap?: Exercise) => {
		setBaiTapDangSua(baiTap || null);
		if (baiTap) {
			bieuMau.setFieldsValue({
				tenBaiTap: baiTap.tenBaiTap,
				nhomCo: baiTap.nhomCo,
				mucDo: baiTap.mucDo,
				moTa: baiTap.moTa,
				huongDan: baiTap.huongDan,
				caloTrungBinhMotGio: baiTap.caloTrungBinhMotGio,
			});
		} else {
			bieuMau.resetFields();
		}
		setMoModal(true);
	};

	const xuLyDongModal = () => {
		setMoModal(false);
		setBaiTapDangSua(null);
		bieuMau.resetFields();
	};

	const xuLyGui = async () => {
		try {
			const giaTri = await bieuMau.validateFields();
			const duLieuBieuMau: DuLieuBieuMauBaiTap = giaTri;

			const duLieuBaiTap = {
				tenBaiTap: duLieuBieuMau.tenBaiTap,
				nhomCo: duLieuBieuMau.nhomCo,
				mucDo: duLieuBieuMau.mucDo,
				moTa: duLieuBieuMau.moTa,
				huongDan: duLieuBieuMau.huongDan,
				caloTrungBinhMotGio: duLieuBieuMau.caloTrungBinhMotGio,
			};

			if (baiTapDangSua) {
				capNhatBaiTap(baiTapDangSua.id, duLieuBaiTap);
			} else {
				themBaiTap(duLieuBaiTap);
			}

			xuLyDongModal();
		} catch (loi) {
			console.error('Xác thực thất bại:', loi);
		}
	};

	const xuLyXoa = (id: string) => {
		xoaBaiTap(id);
	};

	const moModalChiTietBaiTap = (baiTap: Exercise) => {
		setBaiTapDaChon(baiTap);
		setMoModalChiTiet(true);
	};

	const xuLyDongModalChiTiet = () => {
		setMoModalChiTiet(false);
		setBaiTapDaChon(null);
	};

	const layMauDoKho = (mucDo: Exercise['mucDo']) => {
		switch (mucDo) {
			case 'Dễ':
				return 'green';
			case 'Trung bình':
				return 'orange';
			case 'Khó':
				return 'red';
			default:
				return 'default';
		}
	};

	return (
		<div>
			<Space style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap' }}>
				<Input.Search
					placeholder='Tìm kiếm theo tên bài tập...'
					onChange={(e) => setVanBanTimKiem(e.target.value)}
					style={{ width: 200 }}
				/>
				<Select
					placeholder='Lọc theo nhóm cơ'
					style={{ width: 150 }}
					value={locNhomCo}
					onChange={(giaTri) => setLocNhomCo(giaTri)}
				>
					<Option value='all'>Tất cả</Option>
					<Option value='Chest'>Chest</Option>
					<Option value='Back'>Back</Option>
					<Option value='Legs'>Legs</Option>
					<Option value='Shoulders'>Shoulders</Option>
					<Option value='Arms'>Arms</Option>
					<Option value='Core'>Core</Option>
					<Option value='Full Body'>Full Body</Option>
				</Select>
				<Select
					placeholder='Lọc theo độ khó'
					style={{ width: 150 }}
					value={locDoKho}
					onChange={(giaTri) => setLocDoKho(giaTri)}
				>
					<Option value='all'>Tất cả</Option>
					<Option value='Dễ'>Dễ</Option>
					<Option value='Trung bình'>Trung bình</Option>
					<Option value='Khó'>Khó</Option>
				</Select>
				<Button type='primary' icon={<PlusOutlined />} onClick={() => moModalSua()}>
					Thêm bài tập
				</Button>
			</Space>

			<Row gutter={16}>
				{danhSachBaiTapDaLoc.map((baiTap) => (
					<Col span={8} key={baiTap.id} style={{ marginBottom: 16 }}>
						<Card
							hoverable
							onClick={() => moModalChiTietBaiTap(baiTap)}
							extra={
								<Space>
									<Button
										type='link'
										icon={<EditOutlined />}
										onClick={(e) => {
											e.stopPropagation();
											moModalSua(baiTap);
										}}
									/>
									<Popconfirm
										title='Bạn có chắc muốn xóa bài tập này?'
										onConfirm={() => xuLyXoa(baiTap.id)}
										okText='Có'
										cancelText='Không'
									>
										<Button type='link' danger icon={<DeleteOutlined />} onClick={(e) => e.stopPropagation()} />
									</Popconfirm>
								</Space>
							}
						>
							<Meta
								title={baiTap.tenBaiTap}
								description={
									<div>
										<p>
											<strong>Nhóm cơ:</strong> {baiTap.nhomCo}
										</p>
										<Tag color={layMauDoKho(baiTap.mucDo)}>{baiTap.mucDo}</Tag>
										<p>{baiTap.moTa}</p>
										<p>
											<strong>Calo trung bình/giờ:</strong> {baiTap.caloTrungBinhMotGio}
										</p>
									</div>
								}
							/>
						</Card>
					</Col>
				))}
			</Row>

			<Modal
				title={baiTapDangSua ? 'Sửa bài tập' : 'Thêm bài tập'}
				visible={moModal}
				onOk={xuLyGui}
				onCancel={xuLyDongModal}
				okText='Lưu'
				cancelText='Hủy'
				width={600}
			>
				<Form form={bieuMau} layout='vertical'>
					<Form.Item
						name='tenBaiTap'
						label='Tên bài tập'
						rules={[{ required: true, message: 'Vui lòng nhập tên bài tập!' }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						name='nhomCo'
						label='Nhóm cơ tác động'
						rules={[{ required: true, message: 'Vui lòng chọn nhóm cơ!' }]}
					>
						<Select placeholder='Chọn nhóm cơ'>
							<Option value='Chest'>Chest</Option>
							<Option value='Back'>Back</Option>
							<Option value='Legs'>Legs</Option>
							<Option value='Shoulders'>Shoulders</Option>
							<Option value='Arms'>Arms</Option>
							<Option value='Core'>Core</Option>
							<Option value='Full Body'>Full Body</Option>
						</Select>
					</Form.Item>
					<Form.Item name='mucDo' label='Mức độ khó' rules={[{ required: true, message: 'Vui lòng chọn mức độ khó!' }]}>
						<Select placeholder='Chọn mức độ khó'>
							<Option value='Dễ'>Dễ</Option>
							<Option value='Trung bình'>Trung bình</Option>
							<Option value='Khó'>Khó</Option>
						</Select>
					</Form.Item>
					<Form.Item name='moTa' label='Mô tả ngắn' rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
						<Input.TextArea rows={2} />
					</Form.Item>
					<Form.Item
						name='huongDan'
						label='Hướng dẫn thực hiện'
						rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn!' }]}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
					<Form.Item
						name='caloTrungBinhMotGio'
						label='Calo đốt trung bình/giờ'
						rules={[{ required: true, message: 'Vui lòng nhập calo đốt!' }]}
					>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			<Modal
				title={baiTapDaChon?.tenBaiTap}
				visible={moModalChiTiet}
				onCancel={xuLyDongModalChiTiet}
				footer={null}
				width={600}
			>
				{baiTapDaChon && (
					<div>
						<p>
							<strong>Nhóm cơ:</strong> {baiTapDaChon.nhomCo}
						</p>
						<p>
							<strong>Mục độ khó:</strong> <Tag color={layMauDoKho(baiTapDaChon.mucDo)}>{baiTapDaChon.mucDo}</Tag>
						</p>
						<p>
							<strong>Mô tả:</strong> {baiTapDaChon.moTa}
						</p>
						<p>
							<strong>Hướng dẫn thực hiện:</strong>
						</p>
						<div style={{ whiteSpace: 'pre-line' }}>{baiTapDaChon.huongDan}</div>
						<p>
							<strong>Calo đốt trung bình/giờ:</strong> {baiTapDaChon.caloTrungBinhMotGio}
						</p>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ThuVienBaiTap;
