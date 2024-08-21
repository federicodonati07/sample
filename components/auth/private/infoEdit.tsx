import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import supabase from '@/lib/supabase/supabaseClient';

interface InfoEditProps {
  id: string;
  email: string;
  old: string;
  placeH: string;
}

const InfoEdit: React.FC<InfoEditProps> = ({ id, email, old, placeH }) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false)

  // Imposta il valore iniziale dell'inputValue su 'old' se non è già stato modificato
  useEffect(() => {
    setInputValue(old);
  }, [old]);

  const handleEdit = async(id: string, email: string) => {
    if (inputValue.trim() !== '' && inputValue !== old) {

        if(id == "name"){
            const { data, error } = await supabase
                .from('profiles')
                .update([{
                    name: inputValue,
                }])
                .eq('email', email);

            if(error){
                setIsError(true)
                setError(`error ${error}`)
            }else{
                setIsError(false)
                setError("")
                window.location.href = "/private"
            }
        }else if(id == "surname"){
            const { data, error } = await supabase
                .from('profiles')
                .update([{
                    surname: inputValue,
                }])
                .eq('email', email);

            if(error){
                setIsError(true)
                setError(`error ${error}`)
            }else{
                setIsError(false)
                setError("")
                window.location.href = "/private"
            }
        }
      

    } else {
        setIsError(true)
        setError(`fill input with a new correct name`)
        window.location.href = "/private"
    }
  };

  return (
    <>
        <div className='flex flex-col'>
            {isError ? (
                <span className='text-sm text-red-600'>{error}</span>
            ) : ""}
            <div className='flex flex-row space-x-2'>
            <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                placeholder={placeH}
            />
            <Button
                onClick={() => handleEdit(id, email)}
                className='bg-slate-50 text-slate-950'
            >
                Save
            </Button>
            </div>
        </div>
    </>
  );
};

export default InfoEdit;
