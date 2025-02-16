import React, { createContext, useContext, useState, useEffect } from 'react';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface MQTTContextType {
  client: MqttClient | null;
  isConnected: boolean;
  error: Error | null;
  publish: (topic: string, message: string) => void;
  subscribe: (topic: string) => void;
  unsubscribe: (topic: string) => void;
}

const MQTTContext = createContext<MQTTContextType | undefined>(undefined);

export function useMQTT() {
  const context = useContext(MQTTContext);
  if (context === undefined) {
    throw new Error('useMQTT must be used within a MQTTProvider');
  }
  return context;
}

interface MQTTProviderProps {
  children: React.ReactNode;
  brokerUrl?: string;
  options?: IClientOptions;
}

export function MQTTProvider({ 
  children, 
  brokerUrl = 'ws://localhost:9001',
  options = {}
}: MQTTProviderProps) {
  const [client, setClient] = useState<MqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const mqttClient = mqtt.connect(brokerUrl, {
      ...options,
      clientId: `ratlr-web-${Math.random().toString(16).substr(2, 8)}`,
    });

    mqttClient.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    mqttClient.on('error', (err) => {
      setError(err instanceof Error ? err : new Error('MQTT connection error'));
      setIsConnected(false);
    });

    mqttClient.on('close', () => {
      setIsConnected(false);
    });

    mqttClient.on('offline', () => {
      setIsConnected(false);
    });

    setClient(mqttClient);

    return () => {
      if (mqttClient) {
        mqttClient.end();
      }
    };
  }, [brokerUrl, options]);

  const publish = (topic: string, message: string) => {
    if (client && isConnected) {
      client.publish(topic, message, { qos: 1 });
    } else {
      setError(new Error('MQTT client not connected'));
    }
  };

  const subscribe = (topic: string) => {
    if (client && isConnected) {
      client.subscribe(topic, { qos: 1 }, (err) => {
        if (err) {
          setError(err);
        }
      });
    } else {
      setError(new Error('MQTT client not connected'));
    }
  };

  const unsubscribe = (topic: string) => {
    if (client && isConnected) {
      client.unsubscribe(topic, (err) => {
        if (err) {
          setError(err);
        }
      });
    }
  };

  const value = {
    client,
    isConnected,
    error,
    publish,
    subscribe,
    unsubscribe,
  };

  return <MQTTContext.Provider value={value}>{children}</MQTTContext.Provider>;
}