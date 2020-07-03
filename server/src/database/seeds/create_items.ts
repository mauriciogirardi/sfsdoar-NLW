import Knex from 'knex';

export async function seed(knex: Knex) {
	await knex('items').insert([
		{
			title: 'Roupas',
			image: 'roupas.svg',
			url: 'Roupa',
		},
		{
			title: 'Alimento',
			image: 'comida.svg',
			url: 'Alimento',
		},
		{
			title: 'Moveis',
			image: 'moveis.svg',
			url: 'Moveis',
		},
		{
			title: 'Ração',
			image: 'racao.svg',
			url: 'Ração para animais',
		},
		{
			title: 'Outros',
			image: 'outro.svg',
			url: 'Outros ítems',
		},
		{
			title: 'Materias de Construção',
			image: 'material-construcao.svg',
			url: 'Material de Contrução',
		},
	]);
}
