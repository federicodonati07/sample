'use client'

import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabase/supabaseClient';
import Image from 'next/image';
import { Button } from '../ui/button';

const Catalog = () => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            // Ottieni l'URL pubblico dell'immagine
            const { data, error } = await supabase
                .storage
                .from('collections') // Nome del bucket
                .getPublicUrl('graphic.png'); // Percorso dell'immagine all'interno del bucket

            if (error) {
                console.error('Errore nel recupero dell\'immagine:', error);
            } else {
                setImageUrl(data.publicUrl); // Usa l'URL generato senza duplicati
            }
        };

        fetchImage();
    }, []);

    return (
        <div className='flex flex-row justify-center items-center text-white relative'>
            <div className='flex flex-row'>
                <div className='flex flex-col justify-center items-center'>
                    <span className='text-4xl font-black'>WINTER SEASON 2024</span>
                    {imageUrl ? (
                        <Image src={imageUrl} alt="Immagine dal bucket" width={300} height={300} />
                    ) : (
                        <p>Caricamento...</p>
                    )}
                    <div className='flex flex-row'>
                        <Button className='m-2 bg-slate-50 text-slate-950 text-md font-black'>Visit</Button>
                        <Button className='m-2 bg-slate-50 text-slate-950 text-md font-black'>Buy All</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Catalog;
