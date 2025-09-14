import 'package:flutter/material.dart';

class OperatorProvider with ChangeNotifier {
  String? _selectedOperatorId;
  String? _selectedOperatorName;

  String? get selectedOperatorId => _selectedOperatorId;
  String? get selectedOperatorName => _selectedOperatorName;

  void selectOperator(String id, String name) {
    _selectedOperatorId = id;
    _selectedOperatorName = name;
    notifyListeners();
  }

  void clearOperator() {
    _selectedOperatorId = null;
    _selectedOperatorName = null;
    notifyListeners();
  }
}
