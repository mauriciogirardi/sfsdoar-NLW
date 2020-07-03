import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

interface Props {
	onFileUploader: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploader }) => {
	const [selectedFileUrl, setSelectedFileUrl] = useState('');

	const onDrop = useCallback(
		accepiedFiles => {
			const file = accepiedFiles[0];
			const fileUrl = URL.createObjectURL(file);

			setSelectedFileUrl(fileUrl);
			onFileUploader(file);
		},
		[onFileUploader]
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: 'image/*',
	});

	return (
		<div className="dropzone" {...getRootProps()}>
			<input {...getInputProps()} accept="image/*" />

			{selectedFileUrl ? (
				<img src={selectedFileUrl} alt="imagem da doação" />
			) : (
				<p>
					<FiUpload size={20} color="#b02e38" />
					imagem da doação
				</p>
			)}
		</div>
	);
};

export default Dropzone;
