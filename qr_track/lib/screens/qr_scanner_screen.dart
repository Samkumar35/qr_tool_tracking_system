import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:provider/provider.dart';
import '../api/api_service.dart';
import '../providers/operator_provider.dart';

class QrScannerScreen extends StatefulWidget {
  const QrScannerScreen({super.key});

  @override
  State<QrScannerScreen> createState() => _QrScannerScreenState();
}

class _QrScannerScreenState extends State<QrScannerScreen> {
  final ApiService _apiService = ApiService();
  bool _isProcessing = false;

  // Function to show the condition selection dialog
  void _showConditionDialog(String toolId) {
    String selectedCondition = 'good'; // Default value

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return AlertDialog(
              title: const Text('Confirm Tool Condition'),
              content: DropdownButton<String>(
                value: selectedCondition,
                isExpanded: true,
                items: <String>['good', 'fair', 'damaged']
                    .map<DropdownMenuItem<String>>((String value) {
                  return DropdownMenuItem<String>(
                    value: value,
                    child: Text(value.toUpperCase()),
                  );
                }).toList(),
                onChanged: (String? newValue) {
                  setDialogState(() {
                    selectedCondition = newValue!;
                  });
                },
              ),
              actions: <Widget>[
                TextButton(
                  child: const Text('Cancel'),
                  onPressed: () {
                    Navigator.of(context).pop();
                    setState(() => _isProcessing = false);
                  },
                ),
                ElevatedButton(
                  child: const Text('Issue Tool'),
                  onPressed: () {
                    Navigator.of(context).pop(); // Close the dialog
                    _issueTool(toolId, selectedCondition);
                  },
                ),
              ],
            );
          },
        );
      },
    );
  }

  // This function now gets the operator ID from the provider
  void _issueTool(String toolId, String condition) {
    // 1. Get the provider
    final operatorProvider =
        Provider.of<OperatorProvider>(context, listen: false);
    final String? operatorId = operatorProvider.selectedOperatorId;

    if (operatorId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error: No operator selected!')),
      );
      setState(() => _isProcessing = false);
      return;
    }

    // 2. Pass the operatorId to the ApiService
    _apiService.issueTool(toolId, condition, operatorId).then((message) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message), backgroundColor: Colors.green),
      );
    }).catchError((error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.toString()), backgroundColor: Colors.red),
      );
    }).whenComplete(() {
      if (mounted) {
        setState(() => _isProcessing = false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scan to Issue Tool')),
      body: MobileScanner(
        onDetect: (capture) {
          if (!_isProcessing) {
            setState(() => _isProcessing = true);
            final String? toolId = capture.barcodes.first.rawValue;

            if (toolId != null && toolId.isNotEmpty) {
              _showConditionDialog(toolId);
            } else {
              setState(() => _isProcessing = false);
            }
          }
        },
      ),
    );
  }
}
