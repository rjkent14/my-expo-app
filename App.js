import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  Image
} from 'react-native';

export default function App() {
  const [textInput, setTextInput] = useState('');
  const [isEnabled, setIsEnabled] = useState(false);
  const [dynamicComponents, setDynamicComponents] = useState([]);
  const [componentId, setComponentId] = useState(0);

  const showAlert = () => {
    Alert.alert('Button Pressed!', 'This is a button alert.');
  };

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const addButton = () => {
    const newButton = {
      id: componentId,
      type: 'button',
      label: `Dynamic Button ${componentId + 1}`,
      style: componentId % 2 === 0 ? styles.dynamicPrimaryButton : styles.dynamicSecondaryButton,
      onPress: () => Alert.alert(`Button ${componentId + 1}`, `This is dynamic button ${componentId + 1}`)
    };
    setDynamicComponents([...dynamicComponents, newButton]);
    setComponentId(componentId + 1);
  };

  const addTextField = () => {
    const newTextField = {
      id: componentId,
      type: 'textField',
      placeholder: `Dynamic Text Field ${componentId + 1}`,
      value: '',
      multiline: componentId % 2 === 0
    };
    setDynamicComponents([...dynamicComponents, newTextField]);
    setComponentId(componentId + 1);
  };

  const addScrollView = () => {
    const newScrollView = {
      id: componentId,
      type: 'scrollView',
      orientation: componentId % 2 === 0 ? 'horizontal' : 'vertical',
      itemCount: 5
    };
    setDynamicComponents([...dynamicComponents, newScrollView]);
    setComponentId(componentId + 1);
  };

  const addImage = () => {
    const images = [
      { uri: 'https://picsum.photos/200/200?random=1' },
      { uri: 'https://picsum.photos/200/200?random=2' },
      { uri: 'https://picsum.photos/200/200?random=3' },
      { uri: 'https://picsum.photos/200/200?random=4' },
      require('./assets/icon.png'),
      require('./assets/favicon.png'),
      { uri: 'https://via.placeholder.com/200x200/FF6B6B/FFFFFF?text=Hello' },
      { uri: 'https://via.placeholder.com/200x200/4ECDC4/FFFFFF?text=World' }
    ];

    const newImage = {
      id: componentId,
      type: 'image',
      source: images[componentId % images.length],
      title: `Dynamic Image ${componentId + 1}`,
      size: componentId % 3, // 0: small, 1: medium, 2: large
      isRemote: images[componentId % images.length].uri !== undefined
    };
    setDynamicComponents([...dynamicComponents, newImage]);
    setComponentId(componentId + 1);
  };

  const removeComponent = (id) => {
    setDynamicComponents(dynamicComponents.filter(component => component.id !== id));
  };

  const renderDynamicComponent = (component) => {
    switch (component.type) {
      case 'button':
        return (
          <View key={component.id} style={styles.dynamicComponentContainer}>
            <TouchableOpacity
              style={component.style}
              onPress={component.onPress}
            >
              <Text style={component.style === styles.dynamicPrimaryButton ? styles.buttonText : styles.secondaryButtonText}>
                {component.label}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeComponent(component.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      case 'textField':
        return (
          <View key={component.id} style={styles.dynamicComponentContainer}>
            <TextInput
              style={[styles.textInput, component.multiline && styles.multilineInput]}
              placeholder={component.placeholder}
              multiline={component.multiline}
              numberOfLines={component.multiline ? 3 : 1}
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeComponent(component.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      case 'scrollView':
        return (
          <View key={component.id} style={styles.dynamicComponentContainer}>
            <ScrollView
              style={[
                styles.scrollView,
                component.orientation === 'horizontal' && { height: 80 }
              ]}
              horizontal={component.orientation === 'horizontal'}
              showsHorizontalScrollIndicator={component.orientation === 'horizontal'}
              showsVerticalScrollIndicator={component.orientation === 'vertical'}
            >
              {[...Array(component.itemCount)].map((_, index) => (
                <View
                  key={index}
                  style={[
                    component.orientation === 'horizontal' ? styles.scrollItem : styles.verticalScrollItem,
                    component.orientation === 'horizontal' && { marginHorizontal: 5 }
                  ]}
                >
                  <Text style={styles.scrollItemText}>
                    {component.orientation === 'horizontal' ? `H${index + 1}` : `V${index + 1}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeComponent(component.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      case 'image':
        const imageSize = component.size === 0 ? 60 : component.size === 1 ? 100 : 150;
        return (
          <View key={component.id} style={styles.dynamicComponentContainer}>
            <Text style={styles.imageTitle}>{component.title}</Text>
            <Image
              source={component.source}
              style={[
                styles.dynamicImage,
                {
                  width: imageSize,
                  height: imageSize,
                  borderRadius: component.size === 2 ? 20 : 8
                }
              ]}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeComponent(component.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Component Showcase</Text>
      </View>

      {/* Buttons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Buttons</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={showAlert}>
          <Text style={styles.buttonText}>Primary Button</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={() => Alert.alert('Secondary Button')}>
          <Text style={styles.secondaryButtonText}>Secondary Button</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.disabledButton} disabled>
          <Text style={styles.disabledButtonText}>Disabled Button</Text>
        </TouchableOpacity>
      </View>

      {/* Text Fields Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Text Fields</Text>

        <TextInput
          style={styles.textInput}
          placeholder="Enter some text..."
          value={textInput}
          onChangeText={setTextInput}
        />

        <TextInput
          style={[styles.textInput, styles.multilineInput]}
          placeholder="This is a multiline text input..."
          multiline={true}
          numberOfLines={4}
        />

        <Text style={styles.inputValue}>Input Value: {textInput}</Text>
      </View>

      {/* Switches Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Switches & Toggles</Text>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>
            {isEnabled ? 'Switch is ON' : 'Switch is OFF'}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>

      {/* Dynamic Component Controls */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Add Dynamic Components</Text>

        <TouchableOpacity style={styles.primaryButton} onPress={addButton}>
          <Text style={styles.buttonText}>Add Button</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryButton} onPress={addTextField}>
          <Text style={styles.secondaryButtonText}>Add Text Field</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.accentButton} onPress={addScrollView}>
          <Text style={styles.buttonText}>Add Scroll View</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageButton} onPress={addImage}>
          <Text style={styles.buttonText}>Add Image</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Components Display */}
      {dynamicComponents.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dynamic Components</Text>
          {dynamicComponents.map(component => renderDynamicComponent(component))}
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {dynamicComponents.length > 0
            ? `${dynamicComponents.length} dynamic component${dynamicComponents.length > 1 ? 's' : ''} added`
            : 'No dynamic components added yet'
          }
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  section: {
    margin: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#03dac6',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  disabledButtonText: {
    color: '#666666',
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  scrollView: {
    maxHeight: 150,
    marginBottom: 15,
  },
  scrollItem: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  verticalScrollItem: {
    backgroundColor: '#f3e5f5',
    padding: 15,
    marginVertical: 2,
    borderRadius: 8,
  },
  scrollItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: '#333',
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#ffffff',
    fontSize: 16,
  },
  accentButton: {
    backgroundColor: '#ff6b35',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  dynamicComponentContainer: {
    marginBottom: 15,
    position: 'relative',
  },
  dynamicPrimaryButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  dynamicSecondaryButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  removeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#9c27b0',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  dynamicImage: {
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  imageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
});
