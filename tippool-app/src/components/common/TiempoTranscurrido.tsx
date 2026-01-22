import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_SIZE } from '../../constants/design';

interface TiempoTranscurridoProps {
    entrada: string | Date;
    style?: any;
}

export const TiempoTranscurrido: React.FC<TiempoTranscurridoProps> = ({ entrada, style }) => {
    const [tiempo, setTiempo] = useState('');

    useEffect(() => {
        const calcularTiempo = () => {
            const start = new Date(entrada).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            const horas = Math.floor(diff / (1000 * 60 * 60));
            const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((diff % (1000 * 60)) / 1000);

            // Si es menos de 1 hora, mostrar minutos y segundos
            if (horas === 0) {
                setTiempo(`${minutos}min ${segundos}s`);
            } else {
                setTiempo(`${horas}h ${minutos}min`);
            }
        };

        calcularTiempo();
        const interval = setInterval(calcularTiempo, 1000);

        return () => clearInterval(interval);
    }, [entrada]);

    return <Text style={[styles.text, style]}>{tiempo}</Text>;
};

const styles = StyleSheet.create({
    text: {
        fontSize: FONT_SIZE.body,
        color: COLORS.text,
        fontWeight: '600',
    },
});
