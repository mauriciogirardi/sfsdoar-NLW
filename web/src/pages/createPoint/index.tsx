import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import api from '../../services/api';

import Dropzone from '../../components/dropzone';

import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { BsCheckCircle } from 'react-icons/bs';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { LeafletMouseEvent } from 'leaflet';
import { Map, TileLayer, Marker } from 'react-leaflet';

import logo from '../../assets/logo.png';

import './styles.css';

interface Item {
	id: number;
	title: string;
	alt: string;
	image_url: string;
}

interface IBGEUFResponse {
	sigla: string;
}

interface IBGECityResponse {
	nome: string;
}

const CreatePoint = () => {
	const [messageSuccess, setMessageSuccess] = useState(false);

	const [items, setItems] = useState<Item[]>([]);
	const [ufs, setUfs] = useState<string[]>([]);
	const [cities, setCities] = useState<string[]>([]);

	const [formData, setFormData] = useState({
		name: '',
		email: '',
		whatsapp: '',
	});

	const [selectedItems, setSlelectedItems] = useState<number[]>([]);
	const [selectedUf, setSelectedUf] = useState('0');
	const [selectedCity, setSelectedCity] = useState('0');
	const [selectedMapPosition, setSelectedMapPosition] = useState<
		[number, number]
	>([0, 0]);
	const [initialPosition, setInitialPosition] = useState<[number, number]>([
		0,
		0,
	]);
	const [selectedFile, setSelectedFile] = useState<File>();

	useEffect(() => {
		api.get('items').then(response => {
			setItems(response.data);
		});
	}, []);

	useEffect(() => {
		axios
			.get<IBGEUFResponse[]>(
				'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
			)
			.then(response => {
				const ufInitials = response.data.map(uf => uf.sigla);
				setUfs(ufInitials);
			});
	}, []);

	useEffect(() => {
		if (selectedUf === '0') {
			return;
		}

		axios
			.get<IBGECityResponse[]>(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios/`
			)
			.then(response => {
				const cityNames = response.data.map(city => city.nome);
				setCities(cityNames);
			});
	}, [selectedUf]);

	useEffect(() => {
		navigator.geolocation.getCurrentPosition(position => {
			const { latitude, longitude } = position.coords;

			setInitialPosition([latitude, longitude]);
		});
	}, []);

	function handleSelectedUf(e: ChangeEvent<HTMLSelectElement>) {
		const uf = e.target.value;
		setSelectedUf(uf);
	}

	function handleSelectedCity(e: ChangeEvent<HTMLSelectElement>) {
		const city = e.target.value;
		setSelectedCity(city);
	}

	function handleMapClick(e: LeafletMouseEvent) {
		setSelectedMapPosition([e.latlng.lat, e.latlng.lng]);
	}

	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		const { name, value } = e.target;

		setFormData({ ...formData, [name]: value });
	}

	function handleSelectesItem(id: number) {
		const alreadySelected = selectedItems.findIndex(item => item === id);

		if (alreadySelected >= 0) {
			const filterdItems = selectedItems.filter(item => item !== id);
			setSlelectedItems(filterdItems);
		} else {
			setSlelectedItems([...selectedItems, id]);
		}
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();

		const { name, email, whatsapp } = formData;
		const uf = selectedUf;
		const city = selectedCity;
		const [latitude, longitude] = selectedMapPosition;
		const items = selectedItems;

		const data = new FormData();

		data.append('name', name);
		data.append('email', email);
		data.append('whatsapp', whatsapp);
		data.append('latitude', String(latitude));
		data.append('longitude', String(longitude));
		data.append('city', city);
		data.append('uf', uf);
		data.append('items', items.join(','));

		if (selectedFile) {
			data.append('image', selectedFile);
		}

		await api.post('points', data);

		// history.push('/');
	}

	function handleMessageSuccess() {
		setMessageSuccess(true);
	}

	return (
		<div className="bg">
			{messageSuccess && (
				<div className="success">
					<Link to="/">
						<AiOutlineCloseCircle className="iconClose" />
					</Link>
					<div className="success__flex">
						<h1>
							<BsCheckCircle className="iconCheck" />
							<br />
							Cadastro realizado com sucesso.
						</h1>
					</div>
				</div>
			)}

			<div id="page-create-point-donate">
				<header>
					<img src={logo} alt="sfsdoar" />
					<Link to="/">
						<FiArrowLeft className="iconArrowLeft" />
						Voltar para home
					</Link>
				</header>

				<form onSubmit={handleSubmit}>
					<h1>
						Cadastro do <br /> ponto de doação
					</h1>

					<Dropzone onFileUploader={setSelectedFile} />

					<fieldset>
						<legend>
							<h2>Dados</h2>
						</legend>

						<div className="field">
							<label htmlFor="name">Nome</label>
							<input
								type="text"
								name="name"
								id="name"
								onChange={handleInputChange}
							/>
						</div>

						<div className="field__group">
							<div className="field">
								<label htmlFor="email">E-mail</label>
								<input
									type="email"
									name="email"
									id="email"
									onChange={handleInputChange}
								/>
							</div>

							<div className="field">
								<label htmlFor="whatsapp">Whatsapp</label>
								<input
									type="text"
									name="whatsapp"
									id="whatsapp"
									onChange={handleInputChange}
								/>
							</div>
						</div>
					</fieldset>

					<fieldset>
						<legend>
							<h2>Endereço</h2>
							<span>Selecione o endereço no mapa</span>
						</legend>

						<div className="map">
							<Map
								center={initialPosition}
								zoom={15}
								style={{ height: '250px', width: '420px' }}
								onclick={handleMapClick}
							>
								<TileLayer
									attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								/>

								<Marker position={selectedMapPosition} />
							</Map>
						</div>

						<div className="field__group">
							<div className="field">
								<label htmlFor="uf">Uf</label>
								<select
									name="uf"
									id="uf"
									value={selectedUf}
									onChange={handleSelectedUf}
								>
									<option value="0">Selecione o estado</option>
									{ufs.map(uf => (
										<option key={uf} value={uf}>
											{uf}
										</option>
									))}
								</select>
							</div>

							<div className="field">
								<label htmlFor="city">Cidade</label>
								<select
									name="city"
									id="city"
									value={selectedCity}
									onChange={handleSelectedCity}
								>
									<option value="0">Selecione sua cidade</option>
									{cities.map(city => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</select>
							</div>
						</div>
					</fieldset>

					<fieldset>
						<legend>
							<h2>Ítens de doação</h2>
							<span>Selecione um ítem abaixo</span>
						</legend>

						<ul className="items__grid">
							{items.map(item => (
								<li
									key={item.id}
									onClick={() => handleSelectesItem(item.id)}
									className={selectedItems.includes(item.id) ? 'selected' : ''}
								>
									<img src={item.image_url} alt={item.alt} />
									<span>{item.title}</span>
								</li>
							))}
						</ul>
					</fieldset>

					<button onClick={handleMessageSuccess} type="submit">
						Cadastrar ponto de doação
					</button>
				</form>
			</div>
		</div>
	);
};

export default CreatePoint;
