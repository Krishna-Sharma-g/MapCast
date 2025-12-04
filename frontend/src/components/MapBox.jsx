import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const MapBox = ({ center, selectedLocation, onMapClick, onMove }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const moveRef = useRef(onMove);
  const clickRef = useRef(onMapClick);

  useEffect(() => {
    moveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    clickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    if (!containerRef.current) return undefined;

    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [center.lng, center.lat],
      zoom: 4,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl());

    let moveAnimationFrame = null;

    mapRef.current.on('load', () => {
      const loadedCenter = mapRef.current.getCenter();
      moveRef.current?.({ lat: loadedCenter.lat, lng: loadedCenter.lng });
    });

    mapRef.current.on('move', () => {
      if (moveAnimationFrame) return;
      moveAnimationFrame = requestAnimationFrame(() => {
        moveAnimationFrame = null;
        const nextCenter = mapRef.current.getCenter();
        moveRef.current?.({ lat: nextCenter.lat, lng: nextCenter.lng });
      });
    });

    mapRef.current.on('click', (event) => {
      clickRef.current?.({ lat: event.lngLat.lat, lng: event.lngLat.lng });
    });

    return () => {
      if (moveAnimationFrame) {
        cancelAnimationFrame(moveAnimationFrame);
      }
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []); // initialize once

  useEffect(() => {
    if (!mapRef.current) return;
    const targetCenter = selectedLocation
      ? [selectedLocation.lng, selectedLocation.lat]
      : [center.lng, center.lat];

    mapRef.current.easeTo({
      center: targetCenter,
      zoom: selectedLocation ? 9 : 4,
      duration: 800,
    });
  }, [center, selectedLocation]);

  useEffect(() => {
    if (!mapRef.current) return;
    if (!markerRef.current) {
      markerRef.current = new mapboxgl.Marker({ color: '#2563eb' });
    }
    const target = selectedLocation || center;
    markerRef.current
      .setLngLat([target.lng, target.lat])
      .addTo(mapRef.current);
  }, [center, selectedLocation]);

  return (
    <div className="h-[420px] min-h-[320px] w-full rounded-2xl bg-slate-200 shadow-lg lg:h-[640px]">
      <div ref={containerRef} className="h-full w-full rounded-2xl" />
    </div>
  );
};

export default MapBox;