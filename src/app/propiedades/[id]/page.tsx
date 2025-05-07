import React from 'react';

export default async function PrimerPropiedad({params}: {params: {id: string}}) {
    const {id} = await params;
	return <h1>Estas seria la pagina la propiedad: {id}, recibe los parametros 
        como props para la informacion especifica de la propiedad. 
        Hay que usar el id to fetch and display the features of the property</h1>;
}