import React from 'react';
import { Link } from 'react-router-dom';
import { MdInput } from 'react-icons/md';
import logo from '../../assets/logo.png';
import homeBackground from '../../assets/home-background.png';
import './styles.css';

const Home = () => {
	return (
		<div id="home">
			<header>
				<img src={logo} alt="sfsdoar" />
			</header>
			<div className="home__content">
				<main>
					<h1>Amar é doar sem esperar recompensa.</h1>
					<p>
						Ajudamos pessoas a encontrarem pontos de doaçães de forma eficiente.
					</p>
					<Link to="/create-point-donate">
						<span>
							<MdInput className="iconMdInput" />
						</span>
						Cadastrar
					</Link>
				</main>
				<img src={homeBackground} alt="doe sem pensar" />
			</div>
		</div>
	);
};

export default Home;
