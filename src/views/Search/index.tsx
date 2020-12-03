import React, { FormEvent, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import SubHeader from '../../components/SubHeader';
import artistPhoto from '../../assets/Henrell.jpg';

import api from '../../utils/client';
import { getToken } from '../../utils';

import styles from './Search.module.css';

interface ImageData {
  height: number;
  url: string;
  width: number;
}

interface ArtistSearchData {
  external_url: {
    spotify: string;
  };
  followers: {
    href: string;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: ImageData[];
  name: string;
  popularity: number;
  type: string;
  uri: string;
}

const Search: React.FC = () => {
  const [searchArtist, setSearchArtist] = useState<string>('');
  const [inputError, setinputError] = useState<string>('');
  const [artistsList, setArtistsList] = useState<ArtistSearchData[]>([]);

  async function handleSearchArtist(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setinputError('');
    if (searchArtist.length < 4) {
      setinputError('A busca precisa ter pelo menos 4 caracters.')
    } else {
      const token = getToken();

      const artistResults = await api.get('search', {
        params: {
          q: searchArtist,
          type: 'artist'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const albumResults = await api.get('search', {
        params: {
          q: searchArtist,
          type: 'album'
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setArtistsList(artistResults.data.artists.items);
      console.log('artistresults', artistResults.data.artists.items);
      console.log('albumresults', albumResults);
    }
  }

  return (
    <>
      <SubHeader
        buttonHref="/"
        breadcrumb={[{ text: 'Home  >  Busca' }]}
        heading="Somos Front-end Challange"
      />
      <div className={styles.container}>
        <h1>Buscar Artista</h1>

        <form onSubmit={handleSearchArtist}>
          <input
            value={searchArtist}
            onChange={e => setSearchArtist(e.target.value)}
            placeholder="Digite o nome do artista"
          />
          <button type="submit">Pesquisar</button>
        </form>

        {inputError.length > 2 && <p className={styles.error}>{inputError}</p>}

        <div className={styles.artists}>
          {/* <Link
            to="/artista"
          >
            <img
              src={artistPhoto}
              alt="Henrell"
            />
            <div>
              <strong>Artista 1</strong>
              <p>Artista Muito Bom</p>
            </div>
            <FiChevronRight size={20} />
          </Link>

            <Link
              to="/artista"
            >
              <img
                src={artistPhoto}
                alt="Henrell"
              />
              <div>
                <strong>Artista 2</strong>
                <p>Artista Mais ou Menos</p>
              </div>
              <FiChevronRight size={20} />
            </Link> */}
          {artistsList.length > 0 && artistsList.map(artist => (
            <Link
              key={artist.id}
              to={`/artista/${artist.id}`}
            >
              {artist.images.length > 0 && <img
                src={artist.images[0].url}
                alt={`Imagem de ${artist.name}`}
              />}
              <div>
                <strong>{artist.name}</strong>
              </div>
              <FiChevronRight size={20} />
            </Link>
          ))}
        </div>
      </div>

    </>
  )
}

export default Search;
