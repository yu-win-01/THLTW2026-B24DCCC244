import React from 'react';
import { Card, Avatar, Descriptions, Tag } from 'antd';
import useUngDungBlogCaNhan from '@/models/ungdungblogcanhan';

const TrangGioiThieu: React.FC = () => {
	const { author } = useUngDungBlogCaNhan();

	if (!author) return <div>No author information available.</div>;

	return (
		<Card style={{ maxWidth: 600, margin: '0 auto' }}>
			<div style={{ textAlign: 'center', marginBottom: 16 }}>
				<Avatar size={100} src={author.avatar} />
				<h2>{author.name}</h2>
			</div>
			<Descriptions bordered column={1}>
				<Descriptions.Item label='Tiểu sử'>{author.bio}</Descriptions.Item>
				<Descriptions.Item label='Kỹ năng'>
					{author.skills.map((skill) => (
						<Tag key={skill} color='blue'>
							{skill}
						</Tag>
					))}
				</Descriptions.Item>
				<Descriptions.Item label='Liên kết mạng xã hội'>
					{author.socialLinks.map((link) => (
						<div key={link.platform}>
							<a href={link.url} target='_blank' rel='noopener noreferrer'>
								{link.platform}
							</a>
						</div>
					))}
				</Descriptions.Item>
			</Descriptions>
		</Card>
	);
};

export default TrangGioiThieu;
