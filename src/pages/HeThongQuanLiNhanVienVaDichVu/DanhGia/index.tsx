import React, { useState } from 'react';
import { Card, Collapse, Button, Modal, Form, Input, Rate, Empty, Popover, message } from 'antd';
import type { LichHeThong } from '@/models/quanlylichhen';
import useAppointmentSystem from '@/models/quanlylichhen';

const { Panel } = Collapse;

const DanhGia: React.FC = () => {
	const { lichHen, nhanVien, danhGia, themDanhGia, themPhanHoiNhanVien } = useAppointmentSystem();
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [selectedAppointment, setSelectedAppointment] = useState<LichHeThong.LichHen | null>(null);
	const [replyText, setReplyText] = useState('');
	const [replyingRatingId, setReplyingRatingId] = useState<string | null>(null);
	const [form] = Form.useForm();

	const handleOpenModal = (appointment: LichHeThong.LichHen) => {
		setSelectedAppointment(appointment);
		form.resetFields();
		setIsModalVisible(true);
	};

	const handleSubmitRating = async () => {
		try {
			const values = await form.validateFields();
			const appointmentId = selectedAppointment?.id;
			if (!appointmentId) {
				message.error('Lỗi: Không tìm thấy lịch hẹn');
				return;
			}
			if (selectedAppointment) {
				themDanhGia(selectedAppointment.id, {
					idLichHen: appointmentId,
					diemDanhGia: values.diemDanhGia,
					binhLuan: values.binhLuan,
				});
				setIsModalVisible(false);
				setSelectedAppointment(null);
				form.resetFields();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handleReply = (ratingId: string) => {
		if (replyText.trim()) {
			themPhanHoiNhanVien(ratingId, replyText);
			setReplyingRatingId(null);
			setReplyText('');
			message.success('Phản hồi thành công');
		} else {
			message.error('Vui lòng nhập phản hồi');
		}
	};

	const completedAppointments = lichHen.filter((a) => a.trangThai === 'hoan_thanh');
	const unratedAppointments = completedAppointments.filter((a) => !a.danhGia);

	const employeeRatings = nhanVien.map((emp) => {
		const empRatings = danhGia.filter((r) => {
			const apt = lichHen.find((a) => a.id === r.idLichHen);
			return apt && apt.idNhanVien === emp.id;
		});
		return {
			idNhanVien: emp.id,
			tenNhanVien: emp.ten,
			danhGia: empRatings,
			diemTrungBinh:
				empRatings.length > 0 ? empRatings.reduce((sum, r) => sum + r.diemDanhGia, 0) / empRatings.length : 0,
		};
	});

	return (
		<div style={{ padding: '20px' }}>
			<div style={{ marginBottom: '24px' }}>
				<h2>Đánh giá từ khách hàng</h2>

				{unratedAppointments.length > 0 && (
					<Card title='Lịch hẹn chưa được đánh giá' style={{ marginBottom: '16px' }}>
						{unratedAppointments.slice(0, 5).map((apt) => (
							<div key={apt.id} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f5f5f5' }}>
								<div>Khách: {apt.tenKhachHang}</div>
								<div>Ngày: {apt.ngayLichHen}</div>
								<Button size='small' onClick={() => handleOpenModal(apt)}>
									Đánh giá
								</Button>
							</div>
						))}
					</Card>
				)}

				<h3>Đánh giá theo nhân viên</h3>
				{employeeRatings.length === 0 ? (
					<Empty description='Chưa có đánh giá' />
				) : (
					<Collapse>
						{employeeRatings.map((emp) => (
							<Panel
								key={emp.idNhanVien}
								header={
									<div>
										<strong>{emp.tenNhanVien}</strong>
										{emp.diemTrungBinh > 0 && (
											<span style={{ marginLeft: '16px' }}>
												({emp.diemTrungBinh.toFixed(1)}/5 từ {emp.danhGia.length} đánh giá)
											</span>
										)}
									</div>
								}
							>
								<div>
									{emp.danhGia.length === 0 ? (
										<Empty description='Chưa có đánh giá' />
									) : (
										emp.danhGia.map((rating) => (
											<Card key={rating.id} style={{ marginBottom: '12px' }}>
												<div>
													<strong>
														Đánh giá: <Rate disabled defaultValue={rating.diemDanhGia} />
													</strong>
												</div>
												<div style={{ marginTop: '8px', color: '#555' }}>{rating.binhLuan}</div>

												{rating.phanHoiNhanVien && (
													<div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f2f5' }}>
														<strong>Phản hồi từ nhân viên:</strong>
														<p>{rating.phanHoiNhanVien}</p>
													</div>
												)}

												{!rating.phanHoiNhanVien && (
													<Popover
														content={
															<div style={{ width: '300px' }}>
																<Input.TextArea
																	rows={3}
																	placeholder='Nhập phản hồi...'
																	value={replyingRatingId === rating.id ? replyText : ''}
																	onChange={(e) => {
																		setReplyingRatingId(rating.id);
																		setReplyText(e.target.value);
																	}}
																/>
																<Button
																	type='primary'
																	size='small'
																	onClick={() => handleReply(rating.id)}
																	style={{ marginTop: '8px' }}
																>
																	Gửi
																</Button>
															</div>
														}
														title='Phản hồi đánh giá'
														trigger='click'
													>
														<Button size='small' type='dashed' style={{ marginTop: '8px' }}>
															Phản hồi
														</Button>
													</Popover>
												)}
											</Card>
										))
									)}
								</div>
							</Panel>
						))}
					</Collapse>
				)}
			</div>

			<Modal
				title='Đánh giá dịch vụ'
				visible={isModalVisible}
				onOk={handleSubmitRating}
				onCancel={() => {
					setIsModalVisible(false);
					setSelectedAppointment(null);
				}}
			>
				<Form form={form} layout='vertical'>
					<Form.Item label='Mức đánh giá' name='diemDanhGia' rules={[{ required: true }]}>
						<Rate />
					</Form.Item>
					<Form.Item label='Nhận xét' name='binhLuan' rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}>
						<Input.TextArea rows={4} />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default DanhGia;
