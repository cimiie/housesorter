import React, { useEffect, useCallback } from "react";
import PropTypes from 'prop-types';
import { Input } from "@nextui-org/react";
import { useHouseStore } from '../stores/houseStore';

const generateUID = () => Math.random().toString(36).substr(2, 9);

export default function Houses() {
    const { houses, updateHouses } = useHouseStore();

    useEffect(() => {
        if (houses.length < 4) {
            const newHouses = [...houses];
            while (newHouses.length < 4) {
                newHouses.push({ id: generateUID(), name: '' });
            }
            updateHouses(newHouses.slice(0, 4));
        }
    }, [houses, updateHouses]);

    const handleChange = useCallback((index, value) => {
        const newHouses = houses.map((house, i) => {
            if (i === index) {
                return house.id 
                    ? { ...house, name: value }
                    : { id: generateUID(), name: value };
            }
            return house;
        });
        updateHouses(newHouses);
    }, [houses, updateHouses]);

    return (
        <div className="flex items-center justify-center w-full h-full">
            <div className="container mx-auto max-w-2xl flex flex-col items-center gap-8 p-4 sm:p-6">
                <h2 className="text-2xl font-bold mb-4">House Names</h2>
                {houses.slice(0, 4).map((house, index) => (
                    <Input
                        key={house.id || index}
                        type="text"
                        label={`House ${index + 1}`}
                        placeholder="Enter house name"
                        className="w-full max-w-xs"
                        value={house.name || ''}
                        onChange={(e) => handleChange(index, e.target.value)}
                        classNames={{
                            input: "text-base",
                            inputWrapper: [
                                "font-normal",
                                "bg-default-100",
                                "data-[hover=true]:bg-default-200",
                                "min-h-unit-12",
                                "px-4",
                            ],
                            label: "text-default-700 font-medium"
                        }}
                        size="lg"
                    />
                ))}
            </div>
        </div>
    );
}

Houses.propTypes = {};
