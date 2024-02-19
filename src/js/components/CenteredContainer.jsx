import React from 'react';
import { Container } from '@mantine/core';

export default function CenteredContainer(props) {
    return (
        <Container size={props.size || "md"} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 3.5rem)' }}>
            {props.children}
        </Container>
    )
}